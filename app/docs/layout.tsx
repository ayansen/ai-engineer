import type React from "react"
import { DocsHeader } from "@/components/docs/header"
import { DocsSidebar } from "@/components/docs/sidebar"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { DocContextProvider } from "@/components/docs/doc-context"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocContextProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <DocsHeader />
        <div className="flex-1 flex overflow-hidden">
          <aside className="hidden md:block w-64 shrink-0 border-r border-border overflow-y-auto px-4">
            <DocsSidebar />
          </aside>
          <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
          <aside className="hidden lg:flex w-96 shrink-0 border-l border-border flex-col overflow-hidden">
            <ChatSidebar />
          </aside>
        </div>
      </div>
    </DocContextProvider>
  )
}
