export type { DocContent, DocsContentMap } from './types'
import { raiseTheBarContent } from './raise-the-bar'
import { aiNativeContent } from './ai-native'
import { codingAiEraContent } from './coding-ai-era'
import { codeThreeContent } from './code-three'
import { buildingAgentsContent } from './building-agents'
import { referencesContent } from './references'
import { conclusionContent } from './conclusion'
import type { DocsContentMap } from './types'

export { raiseTheBarContent, aiNativeContent, codingAiEraContent, codeThreeContent, buildingAgentsContent, referencesContent, conclusionContent }

export const docsContent: DocsContentMap = {
  ...raiseTheBarContent,
  ...aiNativeContent,
  ...codingAiEraContent,
  ...codeThreeContent,
  ...buildingAgentsContent,
  ...referencesContent,
  ...conclusionContent,
}

export function getAllDocSlugs(): string[] {
  return Object.keys(docsContent)
}

export function getDocContent(slug: string) {
  return docsContent[slug]
}
