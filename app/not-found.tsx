import Link from "next/link"
import { DocsHeader } from "@/components/docs/header"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <DocsHeader />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/docs/getting-started/overview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Getting Started
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/docs/llms/overview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                LLMs & GenAI
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/docs/agents/overview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                AI Agents
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
