"use client"

import * as React from "react"
import { Send, Settings, Bot, User, Loader2, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDocContext } from "@/components/docs/doc-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const STORAGE_KEY = "openrouter_api_key"
const MODEL = "google/gemini-2.0-flash-001"

const SYSTEM_PROMPT = `You are an expert AI engineering instructor for a session called "Raise the Bar!". 
You help developers understand and adopt AI engineering practices.

The session covers these 5 topics:
1. The Art of Possible — Real-world AI applications and what's achievable today
2. Building AI Native Applications — AI agents in everyday workflows: fixing Jira tickets, updating documentation, writing code, generating status reports
3. Deep Dive: Coding in an AI Era — Prompt engineering, shifting from writing code to reviewing code, documenting functions so agents perform better, writing reusable skills for consistency and debugging
4. Tokens, Context Windows & LLM Fundamentals — What tokens are, how context windows work, why this matters for cost and quality
5. The Agent Loop — Relinquishing deterministic control to stochastic agents, understanding the risks and rewards

Be concise, practical, and use concrete examples. When explaining code, use markdown code blocks.
Encourage curiosity and hands-on experimentation.`

const SUGGESTED_QUESTIONS = [
  "What makes an application truly AI-native?",
  "How do tokens and context windows affect my AI app?",
  "What's the agent loop and why should I care?",
  "How do I write better prompts for consistent results?",
  "Show me a real-world example of AI fixing a Jira ticket",
]

function ApiKeyDialog({
  onSave,
  initialKey,
}: {
  onSave: (key: string) => void
  initialKey: string
}) {
  const [value, setValue] = React.useState(initialKey)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSave(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Enter your{" "}
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          OpenRouter API key
        </a>{" "}
        to start chatting.
      </p>
      <input
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="sk-or-..."
        className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        autoFocus
      />
      <Button type="submit" disabled={!value.trim()} size="sm">
        Save Key
      </Button>
    </form>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-2 max-w-full", isUser && "ml-auto flex-row-reverse")}>
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px]",
          isUser
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-muted text-muted-foreground border-border",
        )}
      >
        {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
      </div>
      <div
        className={cn(
          "rounded-lg px-3 py-2 text-xs leading-relaxed max-w-[85%]",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm",
        )}
      >
        {renderMessageContent(message.content)}
      </div>
    </div>
  )
}

function renderMessageContent(content: string): React.ReactNode {
  // Split on code blocks
  const parts = content.split(/(```[\s\S]*?```)/g)
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const match = part.match(/```(\w*)\n?([\s\S]*?)```/)
      const lang = match?.[1] || ""
      const code = match?.[2] || part.slice(3, -3)
      return (
        <pre
          key={i}
          className="mt-1 mb-1 overflow-x-auto rounded bg-background/50 border border-border p-2 text-[10px] font-mono"
        >
          {lang && <div className="text-muted-foreground text-[8px] mb-1 uppercase">{lang}</div>}
          <code>{code.trim()}</code>
        </pre>
      )
    }
    // Handle inline formatting: bold, inline code, line breaks
    return (
      <span key={i}>
        {part.split("\n").map((line, j, arr) => {
          const formatted = line
            .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
            .map((seg, k) => {
              if (seg.startsWith("`") && seg.endsWith("`"))
                return (
                  <code key={k} className="rounded bg-background/50 px-1 py-0.5 font-mono text-[10px]">
                    {seg.slice(1, -1)}
                  </code>
                )
              if (seg.startsWith("**") && seg.endsWith("**"))
                return <strong key={k}>{seg.slice(2, -2)}</strong>
              return seg
            })
          return (
            <React.Fragment key={j}>
              {formatted}
              {j < arr.length - 1 && <br />}
            </React.Fragment>
          )
        })}
      </span>
    )
  })
}

export function ChatSidebar() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [apiKey, setApiKey] = React.useState<string>("")
  const [showSettings, setShowSettings] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { doc } = useDocContext()

  const systemPrompt = React.useMemo(() => {
    let prompt = SYSTEM_PROMPT
    if (doc) {
      prompt += `\n\nThe user is currently reading the following document.\n\n`
      prompt += `**Document title:** ${doc.title}\n`
      prompt += `**Description:** ${doc.description}\n\n`
      prompt += `**Document content:**\n${doc.content}\n\n`
      prompt += `Answer questions based on this document when relevant. Reference specific parts of the document in your answers.`
    }
    return prompt
  }, [doc])

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || ""
    setApiKey(stored)
    if (!stored) setShowSettings(true)
  }, [])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const saveApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
    setShowSettings(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || isLoading || !apiKey) return

    const userMessage: Message = { id: Date.now().toString(), role: "user", content }
    const assistantId = (Date.now() + 1).toString()
    const assistantMessage: Message = { id: assistantId, role: "assistant", content: "" }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
          "X-Title": "Raise the Bar - AI Engineer",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content },
          ],
        }),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`OpenRouter error ${response.status}: ${err}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No response body")

      let accumulated = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6).trim()
          if (data === "[DONE]") continue
          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              accumulated += delta
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
              )
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong"
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `⚠️ ${errorMsg}\n\nCheck your API key in settings.` }
            : m,
        ),
      )
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm">Chat</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowSettings((v) => !v)}
            aria-label="Settings"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
        {doc && (
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground truncate">
            <FileText className="h-3 w-3 shrink-0" />
            <span className="truncate">{doc.title}</span>
          </div>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className="border-t border-border bg-muted/50 p-2 mt-2 rounded">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <ApiKeyDialog onSave={saveApiKey} initialKey={apiKey} />
              </div>
              {apiKey && (
                <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => setShowSettings(false)}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-3 pb-4 text-center">
            <div className="text-sm font-medium mb-2">Ask about AI Engineering</div>
            <p className="text-xs text-muted-foreground mb-3">
              Ask anything about tokens, agents, RAG, prompt engineering, or building AI-native applications.
            </p>

            {!apiKey && (
              <div className="mb-3 p-2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs">
                Add your OpenRouter API key to start chatting.
              </div>
            )}

            <div className="space-y-1 w-full">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => apiKey && sendMessage(q)}
                  disabled={!apiKey}
                  className={cn(
                    "text-left w-full px-2 py-1 rounded text-xs border border-border bg-card transition-colors",
                    apiKey
                      ? "hover:bg-accent hover:border-foreground/20 cursor-pointer"
                      : "opacity-50 cursor-not-allowed",
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-3 py-4 flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
              <div className="flex gap-2 max-w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground border-border">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="rounded bg-muted flex items-center gap-1 px-2 py-1">
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 py-2">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={apiKey ? "Ask… (Enter)" : "Add API key"}
            disabled={!apiKey || isLoading}
            rows={1}
            className="flex-1 resize-none rounded border border-input bg-muted px-2 py-1 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 min-h-[32px] max-h-[100px] leading-relaxed"
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = Math.min(target.scrollHeight, 100) + "px"
            }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || !apiKey || isLoading}
            size="icon"
            className="h-8 w-8 rounded shrink-0"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
