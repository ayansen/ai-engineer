import { notFound } from "next/navigation"
import { getDocContent, getAllDocSlugs } from "@/lib/docs-content"
import { flattenNavItems, docsConfig } from "@/lib/docs-config"
import { MarkdownRenderer } from "@/components/docs/markdown-renderer"
import { Breadcrumb } from "@/components/docs/breadcrumb"
import { DocPagination } from "@/components/docs/pagination"
import { DocContextSetter } from "@/components/docs/doc-context-setter"

export const dynamicParams = false

interface DocsPageProps {
  params: Promise<{ slug?: string[] }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params
  const slugPath = slug?.join("/") || "raise-the-bar/overview"

  const doc = getDocContent(slugPath)
  if (!doc) notFound()

  const flatDocs = flattenNavItems(docsConfig)
  const currentIndex = flatDocs.findIndex((d) => d.href === `/docs/${slugPath}`)
  const prev = currentIndex > 0 ? flatDocs[currentIndex - 1] : undefined
  const next = currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : undefined

  const breadcrumbItems = slugPath.split("/").map((part, index, arr) => {
    const title = part.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    const isLast = index === arr.length - 1
    return { title, href: isLast ? undefined : `/docs/${arr.slice(0, index + 1).join("/")}` }
  })

  return (
    <DocContextSetter title={doc.title} description={doc.description} content={doc.content}>
      <article className="flex-1 min-w-0 px-6 py-8 md:px-8 lg:px-12 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight mb-4">{doc.title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{doc.description}</p>
        <MarkdownRenderer content={doc.content} />
        <DocPagination
          prev={prev ? { title: prev.title, href: prev.href } : undefined}
          next={next ? { title: next.title, href: next.href } : undefined}
        />
      </article>
    </DocContextSetter>
  )
}

export function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return slugs.map((slug) => ({ slug: slug.split("/") }))
}
