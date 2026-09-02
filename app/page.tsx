import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getAllPosts, getAllTags } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { TagBadge } from "@/components/tag-badge"
import { siteConfig } from "@/lib/site"

export default function HomePage() {
  const posts = getAllPosts()
  const latest = posts.slice(0, 5)
  const tags = getAllTags().slice(0, 8)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <section className="border-b border-border py-14 sm:py-20">
        <p className="mb-4 font-mono text-sm text-primary">{"$ whoami"}</p>
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {siteConfig.author}의 개발 기록
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          {siteConfig.description}
        </p>

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <TagBadge key={tag} tag={tag} count={count} />
            ))}
          </div>
        )}
      </section>

      <section className="py-10 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">최근 글</h2>
          <Link
            href="/posts"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            전체 보기
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="flex flex-col gap-4">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            아직 작성된 글이 없습니다. {"content/posts"}에 Markdown 파일을 추가해
            보세요.
          </p>
        )}
      </section>
    </div>
  )
}
