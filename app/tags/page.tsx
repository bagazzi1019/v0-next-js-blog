import type { Metadata } from "next"
import { getAllTags } from "@/lib/posts"
import { TagBadge } from "@/components/tag-badge"

export const metadata: Metadata = {
  title: "태그",
  description: "주제별로 글을 모아 볼 수 있는 태그 목록입니다.",
  alternates: { canonical: "/tags" },
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">태그</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {tags.length}개의 태그로 글을 분류하고 있습니다.
        </p>
      </header>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2.5">
          {tags.map(({ tag, count }) => (
            <TagBadge key={tag} tag={tag} count={count} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">아직 태그가 없습니다.</p>
      )}
    </div>
  )
}
