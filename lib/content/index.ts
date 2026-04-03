export type { DocContent, DocsContentMap } from './types'
import { gettingStartedContent } from './getting-started'
import { foundationsContent } from './foundations'
import { llmsContent } from './llms'
import { ragContent } from './rag'
import { agentsContent } from './agents'
import { mlopsContent } from './mlops'
import { projectsContent } from './projects'
import { resourcesContent } from './resources'
import type { DocsContentMap } from './types'

export { gettingStartedContent, foundationsContent, llmsContent, ragContent, agentsContent, mlopsContent, projectsContent, resourcesContent }

export const docsContent: DocsContentMap = {
  ...gettingStartedContent,
  ...foundationsContent,
  ...llmsContent,
  ...ragContent,
  ...agentsContent,
  ...mlopsContent,
  ...projectsContent,
  ...resourcesContent,
}

export function getAllDocSlugs(): string[] {
  return Object.keys(docsContent)
}

export function getDocContent(slug: string) {
  return docsContent[slug]
}
