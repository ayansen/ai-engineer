"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("")

  const headings = React.useMemo(() => {
    const items: TocItem[] = []
    const lines = content.split("\n")

    for (const line of lines) {
      if (line.startsWith("## ")) {
        const title = line.slice(3).trim()
        const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        items.push({ id, title, level: 2 })
      } else if (line.startsWith("### ")) {
        const title = line.slice(4).trim()
        const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        items.push({ id, title, level: 3 })
      }
    }

    return items
  }, [content])

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-100px 0px -66%" },
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="space-y-1">
      <p className="font-medium text-sm mb-3">On this page</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={cn(heading.level === 3 && "ml-4")}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-1 text-muted-foreground hover:text-foreground transition-colors",
                activeId === heading.id && "text-foreground font-medium",
              )}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
