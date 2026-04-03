"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
}

const languageLabels: Record<string, string> = {
  bash: "Bash",
  shell: "Shell",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tsx: "TSX",
  jsx: "JSX",
  yaml: "YAML",
  json: "JSON",
  python: "Python",
  sql: "SQL",
  text: "Text",
}

export function CodeBlock({ code, language = "bash", filename, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative group rounded-lg border border-code-border bg-code-bg overflow-hidden", className)}>
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-code-border px-4 py-2 text-xs text-muted-foreground">
          <span className="font-mono">{filename || languageLabels[language] || language}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      )}
      <div className="relative">
        {!filename && !language && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="sr-only">Copy code</span>
          </Button>
        )}
        <pre className="overflow-x-auto p-4 text-sm">
          <code className={cn("font-mono", `language-${language}`)}>{code}</code>
        </pre>
      </div>
    </div>
  )
}
