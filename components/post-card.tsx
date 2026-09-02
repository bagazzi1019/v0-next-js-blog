import Link from "next/link"
import Image from "next/image"
import { formatDate, formatDateISO } from "@/lib/format"
import type { PostMeta } from "@/types/post"

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative flex flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:flex-row sm:gap-5">
      {post.coverImage && (
        <Link
          href={`/posts/${post.slug}`}
          className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md sm:aspect-square sm:w-28"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 112px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={formatDateISO(post.date)}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}분 읽기</span>
        </div>

        <h2 className="text-lg font-bold leading-snug tracking-tight text-balance">
          <Link
            href={`/posts/${post.slug}`}
            className="after:absolute after:inset-0 hover:text-primary"
          >
            {post.title}
          </Link>
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground text-pretty">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="relative z-10 rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
