import type React from "react"
import { DocsHeader } from "@/components/docs/header"
import { DocsSidebar } from "@/components/docs/sidebar"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DocsHeader />
      <div className="flex-1 flex">
        <aside className="hidden md:block w-64 shrink-0 border-r border-border">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4">
            <DocsSidebar />
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
