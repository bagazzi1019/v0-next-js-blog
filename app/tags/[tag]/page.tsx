import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getAllPosts, getAllTags } from "@/lib/posts"
import { PostCard } from "@/components/post-card"

type Params = { tag: string }

function resolveTag(param: string): string | null {
  const decoded = decodeURIComponent(param).toLowerCase()
  const match = getAllTags().find(({ tag }) => tag.toLowerCase() === decoded)
  return match ? match.tag : null
}

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: encodeURIComponent(tag.toLowerCase()) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { tag } = await params
  const resolved = resolveTag(tag)
  if (!resolved) return {}
  return {
    title: `#${resolved}`,
    description: `${resolved} 태그가 달린 글 모음입니다.`,
    alternates: { canonical: `/tags/${encodeURIComponent(resolved.toLowerCase())}` },
  }
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { tag } = await params
  const resolved = resolveTag(tag)
  if (!resolved) notFound()

  const posts = getAllPosts().filter((post) => post.tags.includes(resolved))

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/tags"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        모든 태그
      </Link>

      <header className="mb-8">
        <h1 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="text-primary">#</span>
          {resolved}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.length}개의 글
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
