import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/posts"
import { renderMarkdown, extractToc } from "@/lib/markdown"
import { formatDate, formatDateISO } from "@/lib/format"
import { TableOfContents } from "@/components/table-of-contents"
import { PostCard } from "@/components/post-card"
import { TagBadge } from "@/components/tag-badge"
import { siteConfig, getSiteUrl } from "@/lib/site"

type Params = { slug: string }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${getSiteUrl()}/posts/${post.slug}`
  const images = post.coverImage ? [{ url: post.coverImage }] : undefined

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: formatDateISO(post.date),
      modifiedTime: post.updated ? formatDateISO(post.updated) : undefined,
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const html = await renderMarkdown(post.content)
  const toc = extractToc(post.content)
  const related = getRelatedPosts(post)
  const { previous, next } = getAdjacentPosts(post.slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: formatDateISO(post.date),
    dateModified: formatDateISO(post.updated ?? post.date),
    author: { "@type": "Person", name: siteConfig.author },
    keywords: post.tags.join(", "),
    image: post.coverImage ? `${getSiteUrl()}${post.coverImage}` : undefined,
    url: `${getSiteUrl()}/posts/${post.slug}`,
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/posts"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        글 목록
      </Link>

      <article>
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
            {post.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {siteConfig.author}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={formatDateISO(post.date)}>
              {formatDate(post.date)}
            </time>
            {post.updated && post.updated !== post.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>{formatDate(post.updated)} 수정</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}분 읽기</span>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative mb-10 aspect-[2/1] overflow-hidden rounded-lg border border-border">
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="gap-10 lg:grid lg:grid-cols-[1fr_200px]">
          <div
            className="prose-content min-w-0"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </article>

      {(previous || next) && (
        <nav
          aria-label="이전/다음 글"
          className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/posts/${previous.slug}`}
              className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-primary/40"
            >
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5" />
                이전 글
              </span>
              <span className="font-medium leading-snug text-foreground group-hover:text-primary">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/posts/${next.slug}`}
              className="group flex flex-col gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:border-primary/40 sm:items-end"
            >
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                다음 글
                <ArrowRight className="size-3.5" />
              </span>
              <span className="font-medium leading-snug text-foreground group-hover:text-primary">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}

      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="mb-6 text-xl font-bold tracking-tight">연관된 글</h2>
          <div className="flex flex-col gap-4">
            {related.map((rel) => (
              <PostCard key={rel.slug} post={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
