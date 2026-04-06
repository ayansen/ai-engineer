"use client"

import * as React from "react"
import { useDocContext } from "./doc-context"

interface DocContextSetterProps {
  title: string
  description: string
  content: string
  children: React.ReactNode
}

export function DocContextSetter({ title, description, content, children }: DocContextSetterProps) {
  const { setDoc } = useDocContext()

  React.useEffect(() => {
    setDoc({ title, description, content })
  }, [title, description, content, setDoc])

  return <>{children}</>
}
