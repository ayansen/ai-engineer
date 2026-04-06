"use client"

import * as React from "react"
import { CodeBlock } from "./code-block"
import { Callout } from "./callout"

function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [svg, setSvg] = React.useState<string>("")

  React.useEffect(() => {
    let cancelled = false
    import("mermaid").then((mod) => {
      const mermaid = mod.default
      mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" })
      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
      mermaid.render(id, chart).then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered)
      }).catch(() => {
        if (!cancelled) setSvg(`<pre style="color:red">Failed to render diagram</pre>`)
      })
    })
    return () => { cancelled = true }
  }, [chart])

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-muted/30 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderContent = (markdown: string) => {
    const elements: React.ReactNode[] = []
    const lines = markdown.split("\n")
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // Callouts (:::type ... :::)
      if (line.startsWith(":::")) {
        const type = line.slice(3).trim() as "info" | "warning" | "tip" | "danger"
        const contentLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith(":::")) {
          contentLines.push(lines[i])
          i++
        }
        elements.push(
          <Callout key={`callout-${i}`} type={type}>
            {contentLines.join("\n").trim()}
          </Callout>,
        )
        i++
        continue
      }

      // Mermaid diagrams
      if (line.startsWith("```mermaid")) {
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(<MermaidDiagram key={`mermaid-${i}`} chart={codeLines.join("\n")} />)
        i++
        continue
      }

      // Code blocks
      if (line.startsWith("```")) {
        const language = line.slice(3).trim() || "text"
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(<CodeBlock key={`code-${i}`} code={codeLines.join("\n")} language={language} className="my-4" />)
        i++
        continue
      }

      // Headers
      if (line.startsWith("# ")) {
        const title = line.slice(2)
        const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        elements.push(
          <h1 key={`h1-${i}`} id={id} className="scroll-m-20 text-3xl font-bold tracking-tight mt-8 mb-4 first:mt-0">
            {title}
          </h1>,
        )
        i++
        continue
      }

      if (line.startsWith("## ")) {
        const title = line.slice(3)
        const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        elements.push(
          <h2 key={`h2-${i}`} id={id} className="scroll-m-20 text-2xl font-semibold tracking-tight mt-10 mb-4 border-b border-border pb-2">
            {title}
          </h2>,
        )
        i++
        continue
      }

      if (line.startsWith("### ")) {
        const title = line.slice(4)
        const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        elements.push(
          <h3 key={`h3-${i}`} id={id} className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-3">
            {title}
          </h3>,
        )
        i++
        continue
      }

      if (line.startsWith("#### ")) {
        const title = line.slice(5)
        const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        elements.push(
          <h4 key={`h4-${i}`} id={id} className="scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-2">
            {title}
          </h4>,
        )
        i++
        continue
      }

      // Tables
      if (line.includes("|") && lines[i + 1]?.includes("---")) {
        const tableLines: string[] = [line]
        i++
        while (i < lines.length && lines[i].includes("|")) {
          tableLines.push(lines[i])
          i++
        }

        const rows = tableLines.filter((l) => !l.includes("---"))
        const headers = rows[0].split("|").filter((c) => c.trim()).map((c) => c.trim())
        const bodyRows = rows.slice(1).map((row) => row.split("|").filter((c) => c.trim()).map((c) => c.trim()))

        elements.push(
          <div key={`table-${i}`} className="my-6 w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  {headers.map((header, idx) => (
                    <th key={idx} className="py-3 px-4 text-left font-medium text-muted-foreground">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-border">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="py-3 px-4">
                        {renderInlineContent(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )
        continue
      }

      // Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const listItems: string[] = []
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* ") || lines[i].startsWith("  "))) {
          listItems.push(lines[i])
          i++
        }

        elements.push(
          <ul key={`ul-${i}`} className="my-4 ml-6 list-disc space-y-2">
            {listItems.map((item, idx) => {
              const text = item.replace(/^[-*]\s*/, "").trim()
              return (
                <li key={idx} className="text-muted-foreground">
                  {renderInlineContent(text)}
                </li>
              )
            })}
          </ul>,
        )
        continue
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const listItems: string[] = []
        while (i < lines.length && (/^\d+\.\s/.test(lines[i]) || lines[i].startsWith("   "))) {
          listItems.push(lines[i])
          i++
        }

        elements.push(
          <ol key={`ol-${i}`} className="my-4 ml-6 list-decimal space-y-2">
            {listItems.map((item, idx) => {
              const text = item.replace(/^\d+\.\s*/, "").trim()
              return (
                <li key={idx} className="text-muted-foreground">
                  {renderInlineContent(text)}
                </li>
              )
            })}
          </ol>,
        )
        continue
      }

      // Paragraph
      if (line.trim()) {
        elements.push(
          <p key={`p-${i}`} className="leading-7 text-muted-foreground my-4">
            {renderInlineContent(line)}
          </p>,
        )
      }

      i++
    }

    return elements
  }

  const renderInlineContent = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let remaining = text
    let key = 0

    while (remaining) {
      const codeMatch = remaining.match(/`([^`]+)`/)
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)

      const matches = [
        { match: codeMatch, type: "code" },
        { match: boldMatch, type: "bold" },
        { match: linkMatch, type: "link" },
      ].filter((m) => m.match)

      if (matches.length === 0) {
        parts.push(remaining)
        break
      }

      const earliest = matches.reduce((a, b) => ((a.match?.index || 0) < (b.match?.index || 0) ? a : b))
      const match = earliest.match!
      const index = match.index!

      if (index > 0) {
        parts.push(remaining.slice(0, index))
      }

      if (earliest.type === "code") {
        parts.push(
          <code key={key++} className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {match[1]}
          </code>,
        )
        remaining = remaining.slice(index + match[0].length)
      } else if (earliest.type === "bold") {
        parts.push(
          <strong key={key++} className="font-semibold text-foreground">
            {match[1]}
          </strong>,
        )
        remaining = remaining.slice(index + match[0].length)
      } else if (earliest.type === "link") {
        parts.push(
          <a
            key={key++}
            href={match[2]}
            className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
            target={match[2].startsWith("http") ? "_blank" : undefined}
            rel={match[2].startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {match[1]}
          </a>,
        )
        remaining = remaining.slice(index + match[0].length)
      }
    }

    return parts.length === 1 ? parts[0] : parts
  }

  return <div className="prose-custom">{renderContent(content)}</div>
}
