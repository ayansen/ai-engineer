import type * as React from "react"
import { AlertCircle, Info, AlertTriangle, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

type CalloutType = "info" | "warning" | "tip" | "danger"

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const calloutConfig: Record<CalloutType, { icon: React.ReactNode; className: string; defaultTitle: string }> = {
  info: {
    icon: <Info className="h-4 w-4" />,
    className: "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    defaultTitle: "Info",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    defaultTitle: "Warning",
  },
  tip: {
    icon: <Lightbulb className="h-4 w-4" />,
    className: "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400",
    defaultTitle: "Tip",
  },
  danger: {
    icon: <AlertCircle className="h-4 w-4" />,
    className: "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400",
    defaultTitle: "Danger",
  },
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type]

  return (
    <div className={cn("my-6 flex gap-3 rounded-lg border p-4", config.className)}>
      <div className="mt-0.5 shrink-0">{config.icon}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-sm opacity-90 text-foreground">{children}</div>
      </div>
    </div>
  )
}
