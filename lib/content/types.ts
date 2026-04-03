export interface DocContent {
  slug: string
  title: string
  description: string
  content: string
}

export type DocsContentMap = Record<string, DocContent>
