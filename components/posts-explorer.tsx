"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { PostCard } from "@/components/post-card"
import type { PostMeta } from "@/types/post"
import { cn } from "@/lib/utils"

export function PostsExplorer({
  posts,
  tags,
}: {
  posts: PostMeta[]
  tags: { tag: string; count: number }[]
}) {
  const [query, setQuery] = React.useState("")
  const [activeTag, setActiveTag] = React.useState<string | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesTag = activeTag ? post.tags.includes(activeTag) : true
      const matchesQuery = q
        ? post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q))
        : true
      return matchesTag && matchesQuery
    })
  }, [posts, query, activeTag])

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목, 내용, 태그 검색…"
          aria-label="글 검색"
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="검색어 지우기"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="전체"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tags.map(({ tag, count }) => (
            <FilterChip
              key={tag}
              label={`${tag} ${count}`}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length}개의 글
      </p>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}
