"use client"

import * as React from "react"
import * as ReactDOM from "react-dom"
import { useRouter } from "next/navigation"
import { Send, Settings, Bot, User, Loader2, X, FileText, Navigation, Mic, MicOff, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDocContext } from "@/components/docs/doc-context"
import { flattenNavItems, docsConfig } from "@/lib/docs-config"

interface Message {
  id: string
  role: "user" | "assistant" | "tool-action" | "diagram"
  content: string
}

const STORAGE_KEY = "openrouter_api_key"
const DEFAULT_API_KEY = "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"
const MODEL = "openrouter/free"

const NAV_PAGES = flattenNavItems(docsConfig)

const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "navigate_to_page",
      description:
        "Navigate the user to a specific documentation page. Use this when the user asks to go to, show, or open a page or topic. Available pages: " +
        NAV_PAGES.map((p) => `"${p.title}" (${p.href})`).join(", "),
      parameters: {
        type: "object",
        properties: {
          href: {
            type: "string",
            description: "The href path to navigate to, e.g. /docs/references/reading-list",
            enum: NAV_PAGES.map((p) => p.href),
          },
        },
        required: ["href"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "draw_diagram",
      description:
        "Draw a Mermaid diagram and display it in the chat. Use this when the user asks to draw, visualize, or diagram something — for example sequence diagrams, flowcharts, architecture diagrams, class diagrams, state diagrams, etc. Generate valid Mermaid syntax.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "A short title for the diagram",
          },
          chart: {
            type: "string",
            description: "Valid Mermaid diagram syntax, e.g. 'sequenceDiagram\\n    Alice->>Bob: Hello'",
          },
        },
        required: ["title", "chart"],
      },
    },
  },
]

const SYSTEM_PROMPT = `You are an expert AI engineering instructor for a session called "Raise the Bar!", authored by Ayan. 
You help developers understand and adopt AI engineering practices.

You have access to these tools:
- navigate_to_page: Navigate the user to any documentation page. Use when asked to go to or show a page.
- draw_diagram: Draw a Mermaid diagram in the chat. Use when asked to draw, visualize, or diagram something. Generate valid Mermaid syntax (sequenceDiagram, flowchart, graph, classDiagram, stateDiagram, etc).

When answering questions, also answer with text — do not only use tools.

Be concise, practical, and use concrete examples. When explaining code, use markdown code blocks.
Encourage curiosity and hands-on experimentation.`

const SUGGESTED_QUESTIONS = [
  "What makes an application truly AI-native?",
  "Take me to the references page",
  "Draw a sequence diagram of an agentic workflow",
  "Show me the page about prompt engineering",
  "How is coding changing with AI?",
]

const AUTO_READ_KEY = "chat_auto_read"
const VOICE_MODE_KEY = "chat_voice_mode"

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " code block omitted ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionInstance = any

function useVoiceInput() {
  const [isListening, setIsListening] = React.useState(false)
  const [isSupported, setIsSupported] = React.useState(false)
  const recognitionRef = React.useRef<SpeechRecognitionInstance>(null)
  const wantListeningRef = React.useRef(false)
  const onResultRef = React.useRef<(transcript: string, isFinal: boolean) => void>(() => {})

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    setIsSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition))
  }, [])

  const start = React.useCallback(
    (onResult: (transcript: string, isFinal: boolean) => void) => {
      if (!isSupported || wantListeningRef.current) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition
      const recognition = new SR()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      onResultRef.current = onResult

      recognition.onresult = (event: SpeechRecognitionInstance) => {
        const last = event.results[event.results.length - 1]
        onResultRef.current(last[0].transcript, last.isFinal)
      }

      recognition.onerror = (event: SpeechRecognitionInstance) => {
        const fatal = ["not-allowed", "service-not-allowed", "network"]
        if (fatal.includes(event.error)) {
          wantListeningRef.current = false
          setIsListening(false)
          recognitionRef.current = null
        }
      }

      recognition.onend = () => {
        if (wantListeningRef.current) {
          try { recognition.start() } catch { /* ignore */ }
        } else {
          setIsListening(false)
          recognitionRef.current = null
        }
      }

      recognitionRef.current = recognition
      wantListeningRef.current = true
      setIsListening(true)
      recognition.start()
    },
    [isSupported],
  )

  const stop = React.useCallback(() => {
    wantListeningRef.current = false
    setIsListening(false)
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch { /* ignore */ }
      recognitionRef.current = null
    }
  }, [])

  return { isListening, isSupported, start, stop }
}

function useVoiceOutput() {
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [isSupported, setIsSupported] = React.useState(false)
  const currentUtteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null)

  React.useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window)
  }, [])

  const speak = React.useCallback((text: string, onEnd?: () => void) => {
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const clean = stripMarkdown(text)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.rate = 1.1
    utterance.onend = () => { setIsSpeaking(false); currentUtteranceRef.current = null; onEnd?.() }
    utterance.onerror = () => { setIsSpeaking(false); currentUtteranceRef.current = null; onEnd?.() }
    currentUtteranceRef.current = utterance
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = React.useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }
  }, [])

  return { isSpeaking, isSupported, speak, stop }
}

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

function ChatMermaidDiagram({ chart, title }: { chart: string; title?: string }) {
  const [svg, setSvg] = React.useState<string>("")
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    import("mermaid").then((mod) => {
      const mermaid = mod.default
      mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" })
      const id = `chat-mermaid-${Math.random().toString(36).slice(2, 9)}`
      mermaid.render(id, chart).then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered)
      }).catch(() => {
        if (!cancelled) setSvg(`<pre style="color:red;font-size:10px">Failed to render diagram</pre>`)
      })
    })
    return () => { cancelled = true }
  }, [chart])

  // Close on Escape key
  React.useEffect(() => {
    if (!expanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [expanded])

  return (
    <>
      <div className="rounded-lg border border-border bg-muted/30 p-2 my-1 group/diagram relative">
        {title && <div className="text-[10px] font-medium text-muted-foreground mb-1">{title}</div>}
        <div
          className="overflow-x-auto flex justify-center [&_svg]:max-w-full [&_svg]:h-auto cursor-pointer"
          onClick={() => setExpanded(true)}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <button
          onClick={() => setExpanded(true)}
          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-background/80 border border-border text-muted-foreground hover:text-foreground opacity-0 group-hover/diagram:opacity-100 transition-opacity"
          aria-label="Expand diagram"
        >
          <Maximize2 className="h-3 w-3" />
        </button>
      </div>

      {/* Expanded overlay rendered via portal */}
      {expanded && typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setExpanded(false) }}
          >
            <div className="relative bg-background border border-border rounded-xl shadow-2xl w-[95vw] h-[95vh] overflow-auto p-8">
              <div className="flex items-center justify-between mb-4">
                {title && <h3 className="text-base font-semibold">{title}</h3>}
                <button
                  onClick={() => setExpanded(false)}
                  className="ml-auto p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close expanded diagram"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
              <div
                className="flex items-center justify-center h-[calc(95vh-6rem)] [&_svg]:w-full [&_svg]:h-full [&_svg]:max-h-[calc(95vh-7rem)]"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </div>,
          document.body
        )
      }
    </>
  )
}

function MessageBubble({ message, voiceOutput }: { message: Message; voiceOutput?: ReturnType<typeof useVoiceOutput> }) {
  if (message.role === "tool-action") {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary">
        <Navigation className="h-3 w-3 shrink-0" />
        <span>{message.content}</span>
      </div>
    )
  }

  if (message.role === "diagram") {
    try {
      const { title, chart } = JSON.parse(message.content)
      return <ChatMermaidDiagram chart={chart} title={title} />
    } catch {
      return null
    }
  }

  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"

  return (
    <div className={cn("flex gap-2 max-w-full group", isUser && "ml-auto flex-row-reverse")}>
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
      <div className="flex flex-col max-w-[85%]">
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-xs leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm",
          )}
        >
          {renderMessageContent(message.content)}
        </div>
        {isAssistant && voiceOutput?.isSupported && (
          <button
            onClick={() =>
              voiceOutput.isSpeaking ? voiceOutput.stop() : voiceOutput.speak(message.content)
            }
            className="self-start mt-0.5 p-0.5 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={voiceOutput.isSpeaking ? "Stop reading" : "Read aloud"}
          >
            {voiceOutput.isSpeaking ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </button>
        )}
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
      // Render mermaid blocks as diagrams
      if (lang === "mermaid") {
        return <ChatMermaidDiagram key={i} chart={code.trim()} />
      }
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
  const [autoRead, setAutoRead] = React.useState(false)
  const [voiceMode, setVoiceMode] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { doc } = useDocContext()
  const router = useRouter()

  const voiceOutput = useVoiceOutput()
  const voiceInput = useVoiceInput()

  // Ref so the voice input callback can call sendMessage without stale closures
  const sendRef = React.useRef<(text: string) => void>(() => {})
  const voiceModeRef = React.useRef(false)
  voiceModeRef.current = voiceMode

  const startListeningForVoiceMode = React.useCallback(() => {
    voiceInput.start((transcript: string, isFinal: boolean) => {
      setInput(transcript)
      if (isFinal && voiceModeRef.current) {
        setInput("")
        sendRef.current(transcript)
      }
    })
  }, [voiceInput])

  const startManualListening = React.useCallback(() => {
    voiceInput.start((transcript: string) => {
      setInput(transcript)
    })
  }, [voiceInput])

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
    const stored = localStorage.getItem(STORAGE_KEY) || DEFAULT_API_KEY
    setApiKey(stored)
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, DEFAULT_API_KEY)
    }
    setAutoRead(localStorage.getItem(AUTO_READ_KEY) === "true")
    setVoiceMode(localStorage.getItem(VOICE_MODE_KEY) === "true")
  }, [])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Auto-read new assistant messages when autoRead is on (but not voice mode — voice mode handles its own loop)
  const prevMessageCountRef = React.useRef(0)
  React.useEffect(() => {
    if (!voiceMode && autoRead && voiceOutput.isSupported && messages.length > prevMessageCountRef.current) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg?.role === "assistant" && lastMsg.content && !lastMsg.content.startsWith("⚠️")) {
        voiceOutput.speak(lastMsg.content)
      }
    }
    prevMessageCountRef.current = messages.length
  }, [messages, autoRead, voiceMode, voiceOutput])

  const saveApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
    setShowSettings(false)
  }

  const toggleAutoRead = () => {
    const next = !autoRead
    setAutoRead(next)
    localStorage.setItem(AUTO_READ_KEY, String(next))
    if (!next) voiceOutput.stop()
  }

  const toggleVoiceMode = () => {
    const next = !voiceMode
    setVoiceMode(next)
    localStorage.setItem(VOICE_MODE_KEY, String(next))
    if (next) {
      // Turn on: start listening immediately
      startListeningForVoiceMode()
    } else {
      // Turn off: stop everything
      voiceInput.stop()
      voiceOutput.stop()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const callLLM = async (llmMessages: Array<{ role: string; content?: string; tool_call_id?: string; name?: string }>) => {
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
        tools: TOOLS,
        messages: llmMessages,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`OpenRouter error ${response.status}: ${err}`)
    }

    return response.json()
  }

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || isLoading || !apiKey) return

    // Stop listening while we process (voice mode will restart after TTS)
    voiceInput.stop()

    const userMessage: Message = { id: Date.now().toString(), role: "user", content }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const llmHistory = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }))

    const llmMessages: Array<{ role: string; content?: string; tool_call_id?: string; name?: string }> = [
      { role: "system", content: systemPrompt },
      ...llmHistory,
      { role: "user", content },
    ]

    let finalResponse = ""

    try {
      let maxIterations = 5
      while (maxIterations-- > 0) {
        const data = await callLLM(llmMessages)
        const choice = data.choices?.[0]

        if (choice?.message?.tool_calls && choice.message.tool_calls.length > 0) {
          llmMessages.push(choice.message)

          for (const toolCall of choice.message.tool_calls) {
            if (toolCall.function?.name === "navigate_to_page") {
              const args = JSON.parse(toolCall.function.arguments)
              const href = args.href
              const page = NAV_PAGES.find((p) => p.href === href)
              const pageName = page?.title || href

              const actionId = Date.now().toString() + "-nav"
              setMessages((prev) => [
                ...prev,
                { id: actionId, role: "tool-action", content: `Navigating to ${pageName}…` },
              ])

              router.push(href)

              llmMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: `Successfully navigated the user to "${pageName}" at ${href}.`,
              })
            }

            if (toolCall.function?.name === "draw_diagram") {
              const args = JSON.parse(toolCall.function.arguments)
              const { title, chart } = args

              const diagramId = Date.now().toString() + "-diagram"
              setMessages((prev) => [
                ...prev,
                { id: diagramId, role: "diagram", content: JSON.stringify({ title, chart }) },
              ])

              llmMessages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: `Successfully rendered the "${title}" diagram for the user.`,
              })
            }
          }
          continue
        }

        const textContent = choice?.message?.content || ""
        if (textContent) {
          finalResponse = textContent
          const assistantId = Date.now().toString() + "-reply"
          setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: textContent }])
        }
        break
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong"
      const errId = Date.now().toString() + "-err"
      setMessages((prev) => [
        ...prev,
        { id: errId, role: "assistant", content: `⚠️ ${errorMsg}\n\nCheck your API key in settings.` },
      ])
    } finally {
      setIsLoading(false)

      // Voice mode loop: read response aloud, then re-start listening
      if (voiceModeRef.current && finalResponse && !finalResponse.startsWith("⚠️")) {
        voiceOutput.speak(finalResponse, () => {
          if (voiceModeRef.current) {
            startListeningForVoiceMode()
          }
        })
      } else if (voiceModeRef.current) {
        // No response to read — just re-start listening
        startListeningForVoiceMode()
      } else {
        inputRef.current?.focus()
      }
    }
  }

  // Keep sendRef in sync so voice input callback can call sendMessage
  sendRef.current = sendMessage

  const isEmpty = messages.length === 0
  const voiceAvailable = voiceInput.isSupported && voiceOutput.isSupported

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm">Chat</span>
          <div className="flex items-center gap-1">
            {voiceAvailable && (
              <Button
                variant={voiceMode ? "default" : "ghost"}
                size="icon"
                className={cn("h-6 w-6", voiceMode && "bg-red-500 hover:bg-red-600 text-white")}
                onClick={toggleVoiceMode}
                disabled={!apiKey}
                aria-label={voiceMode ? "Disable voice mode" : "Enable voice mode"}
                title={voiceMode ? "Voice mode ON — click to disable" : "Voice mode — auto listen & speak"}
              >
                {voiceMode ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
              </Button>
            )}
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
        </div>
        {voiceMode && (
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-red-500 font-medium">
            <Mic className={cn("h-3 w-3", voiceInput.isListening && "animate-pulse")} />
            <span>{voiceInput.isListening ? "Listening…" : voiceOutput.isSpeaking ? "Speaking…" : "Voice mode"}</span>
          </div>
        )}
        {doc && !voiceMode && (
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
            {voiceOutput.isSupported && (
              <label className="flex items-center gap-2 mt-2 pt-2 border-t border-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRead}
                  onChange={toggleAutoRead}
                  className="rounded border-input h-3 w-3 accent-primary"
                />
                <span className="text-xs text-muted-foreground">Auto-read responses</span>
                <Volume2 className="h-3 w-3 text-muted-foreground" />
              </label>
            )}
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
              <MessageBubble key={message.id} message={message} voiceOutput={voiceOutput} />
            ))}
            {isLoading && (
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
            placeholder={apiKey ? (voiceInput.isListening ? "Listening…" : "Ask… (Enter)") : "Add API key"}
            disabled={!apiKey || isLoading}
            rows={1}
            className={cn(
              "flex-1 resize-none rounded border border-input bg-muted px-2 py-1 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 min-h-[32px] max-h-[100px] leading-relaxed",
              voiceInput.isListening && "ring-2 ring-red-500/50 border-red-500/50",
            )}
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = Math.min(target.scrollHeight, 100) + "px"
            }}
          />
          {voiceInput.isSupported && !voiceMode && (
            <Button
              onClick={() => voiceInput.isListening ? voiceInput.stop() : startManualListening()}
              disabled={!apiKey || isLoading}
              variant={voiceInput.isListening ? "destructive" : "outline"}
              size="icon"
              className={cn("h-8 w-8 rounded shrink-0", voiceInput.isListening && "animate-pulse")}
              aria-label={voiceInput.isListening ? "Stop listening" : "Voice input"}
            >
              {voiceInput.isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
            </Button>
          )}
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
