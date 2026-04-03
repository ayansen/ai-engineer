"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, Moon, Sun, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DocsSidebar } from "./sidebar"

export function DocsHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-14 items-center border-b border-border px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="text-lg">AI Engineer</span>
              </Link>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-3.5rem)] px-4">
              <DocsSidebar />
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 font-semibold mr-6">
          <span className="text-lg hidden sm:inline-block">AI Engineer</span>
          <span className="text-lg sm:hidden">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/docs/getting-started/overview" className="text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </Link>
          <Link href="/docs/getting-started/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
            Roadmap
          </Link>
          <Link href="/docs/projects/overview" className="text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href="https://github.com/ayansen/ai-engineer" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
