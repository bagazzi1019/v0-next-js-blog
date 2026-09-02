import type { Metadata } from "next"
import { getAllPosts, getAllTags } from "@/lib/posts"
import { PostsExplorer } from "@/components/posts-explorer"

export const metadata: Metadata = {
  title: "글",
  description: "작성한 모든 글을 검색하고 태그로 필터링해 보세요.",
  alternates: { canonical: "/posts" },
}

export default function PostsPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">글</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          지금까지 작성한 {posts.length}개의 글입니다.
        </p>
      </header>

      <PostsExplorer posts={posts} tags={tags} />
    </div>
  )
}
