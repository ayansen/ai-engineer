import { notFound } from "next/navigation"
import { getDocContent, getAllDocSlugs } from "@/lib/docs-content"
import { flattenNavItems, docsConfig } from "@/lib/docs-config"
import { MarkdownRenderer } from "@/components/docs/markdown-renderer"
import { TableOfContents } from "@/components/docs/toc"
import { Breadcrumb } from "@/components/docs/breadcrumb"
import { DocPagination } from "@/components/docs/pagination"

export const dynamicParams = false

interface DocsPageProps {
  params: Promise<{ slug?: string[] }>
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params
  const slugPath = slug?.join("/") || "getting-started/overview"

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
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-8 md:px-8 lg:px-12 max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight mb-4">{doc!.title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{doc!.description}</p>
        <MarkdownRenderer content={doc!.content} />
        <DocPagination
          prev={prev ? { title: prev.title, href: prev.href } : undefined}
          next={next ? { title: next.title, href: next.href } : undefined}
        />
      </article>
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 px-4">
          <TableOfContents content={doc!.content} />
        </div>
      </aside>
    </div>
  )
}

export function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return slugs.map((slug) => ({ slug: slug.split("/") }))
}
