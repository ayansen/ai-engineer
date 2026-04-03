"use client"

import * as React from "react"
import { Send, Settings, Bot, User, Loader2, X, Zap, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Enter your{" "}
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          OpenRouter API key
        </a>{" "}
        to start chatting. It's stored only in your browser.
      </p>
      <input
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="sk-or-..."
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        autoFocus
      />
      <Button type="submit" disabled={!value.trim()}>
        Save Key
      </Button>
    </form>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 max-w-3xl", isUser && "ml-auto flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
          isUser
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-muted text-muted-foreground border-border",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%]",
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
          className="mt-2 mb-2 overflow-x-auto rounded-lg bg-background/50 border border-border p-3 text-xs font-mono"
        >
          {lang && <div className="text-muted-foreground text-[10px] mb-1 uppercase">{lang}</div>}
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
                  <code key={k} className="rounded bg-background/50 px-1 py-0.5 font-mono text-xs">
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

export function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [apiKey, setApiKey] = React.useState<string>("")
  const [showSettings, setShowSettings] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

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
            { role: "system", content: SYSTEM_PROMPT },
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
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6 gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Raise the bar!</span>
          </div>

          <div className="hidden md:flex items-center gap-1 ml-4 text-sm text-muted-foreground">
            <ChevronRight className="h-3.5 w-3.5" />
            <span>AI Engineering Session</span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="hidden sm:inline-flex text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {MODEL.split("/")[1]}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSettings((v) => !v)}
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="border-t border-border bg-muted/50 px-4 md:px-6 py-4">
            <div className="max-w-md flex items-start gap-3">
              <div className="flex-1">
                <ApiKeyDialog onSave={saveApiKey} initialKey={apiKey} />
              </div>
              {apiKey && (
                <Button variant="ghost" size="icon" className="h-8 w-8 mt-6 shrink-0" onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4 pb-32">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-6">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-center">Raise the bar!</h1>
            <p className="text-muted-foreground text-center max-w-md mb-10 leading-relaxed">
              Ask anything about AI engineering — tokens, agents, RAG, prompt engineering,
              or how to build AI-native applications.
            </p>

            {!apiKey && (
              <div className="mb-8 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm max-w-md text-center">
                Add your OpenRouter API key above to start chatting.
              </div>
            )}

            <div className="grid gap-2 w-full max-w-lg">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => apiKey && sendMessage(q)}
                  disabled={!apiKey}
                  className={cn(
                    "text-left px-4 py-3 rounded-xl border border-border bg-card text-sm transition-colors",
                    apiKey
                      ? "hover:bg-accent hover:border-foreground/20 cursor-pointer"
                      : "opacity-50 cursor-not-allowed",
                  )}
                >
                  <span className="text-muted-foreground mr-2">→</span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-8 flex flex-col gap-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
              <div className="flex gap-3 max-w-3xl">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground border-border">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-muted flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-4">
        <div className="mx-auto max-w-3xl flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={apiKey ? "Ask about AI engineering… (Enter to send, Shift+Enter for newline)" : "Add your API key to start"}
            disabled={!apiKey || isLoading}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-muted px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 min-h-[48px] max-h-[200px] leading-relaxed"
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = Math.min(target.scrollHeight, 200) + "px"
            }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || !apiKey || isLoading}
            size="icon"
            className="h-12 w-12 rounded-xl shrink-0"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Powered by{" "}
          <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
            OpenRouter
          </a>
          {" · "}
          Your API key never leaves your browser
        </p>
      </div>
    </div>
  )
}
