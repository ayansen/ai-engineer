import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  items: { title: string; href?: string }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      <Link href="/" className="hover:text-foreground transition-colors">
        Docs
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.title}
            </Link>
          ) : (
            <span className="text-foreground">{item.title}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
