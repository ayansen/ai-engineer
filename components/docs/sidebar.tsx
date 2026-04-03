"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { docsConfig, type NavItem } from "@/lib/docs-config"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

function NavItems({
  items,
  level = 0,
}: {
  items: NavItem[]
  level?: number
}) {
  const pathname = usePathname()

  return (
    <ul className={cn("space-y-1", level > 0 && "ml-4 border-l border-border pl-4")}>
      {items.map((item, index) => {
        const isActive = item.href === pathname
        const hasChildren = item.items && item.items.length > 0
        const isChildActive =
          hasChildren &&
          item.items?.some((child) => child.href === pathname || child.items?.some((c) => c.href === pathname))

        if (hasChildren) {
          return (
            <li key={index}>
              <Collapsible defaultOpen={isChildActive}>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors [&[data-state=open]>svg]:rotate-90">
                  {item.title}
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <NavItems items={item.items!} level={level + 1} />
                </CollapsibleContent>
              </Collapsible>
            </li>
          )
        }

        return (
          <li key={index}>
            <Link
              href={item.href || "#"}
              className={cn(
                "block py-1.5 text-sm transition-colors",
                isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function DocsSidebar() {
  return (
    <nav className="space-y-6 py-4">
      <NavItems items={docsConfig} />
    </nav>
  )
}
