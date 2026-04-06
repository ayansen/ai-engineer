"use client"

import * as React from "react"

interface DocContext {
  title: string
  description: string
  content: string
}

interface DocContextValue {
  doc: DocContext | null
  setDoc: (doc: DocContext | null) => void
}

const DocContextCtx = React.createContext<DocContextValue>({
  doc: null,
  setDoc: () => {},
})

export function DocContextProvider({ children }: { children: React.ReactNode }) {
  const [doc, setDoc] = React.useState<DocContext | null>(null)

  return (
    <DocContextCtx.Provider value={{ doc, setDoc }}>
      {children}
    </DocContextCtx.Provider>
  )
}

export function useDocContext() {
  return React.useContext(DocContextCtx)
}
