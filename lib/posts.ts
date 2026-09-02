import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { calculateReadingTime, createExcerpt } from "@/lib/markdown"
import type { Post, PostMeta } from "@/types/post"

const POSTS_DIR = path.join(process.cwd(), "content", "posts")

function readPostFile(fileName: string): Post {
  const fullPath = path.join(POSTS_DIR, fileName)
  const raw = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(raw)

  const slug = (data.slug as string) || fileName.replace(/\.md$/, "")

  return {
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    updated: data.updated,
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage,
    slug,
    related: Array.isArray(data.related) ? data.related : [],
    readingTime: calculateReadingTime(content),
    excerpt: data.description || createExcerpt(content),
    content,
  }
}

function toMeta(post: Post): PostMeta {
  const { content, ...meta } = post
  return meta
}

let cache: Post[] | null = null

function loadPosts(): Post[] {
  if (cache) return cache
  if (!fs.existsSync(POSTS_DIR)) return []

  cache = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPostFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return cache
}

export function getAllPosts(): PostMeta[] {
  return loadPosts().map(toMeta)
}

export function getPostBySlug(slug: string): Post | null {
  return loadPosts().find((p) => p.slug === slug) ?? null
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of loadPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function getRelatedPosts(post: Post, limit = 3): PostMeta[] {
  const all = loadPosts().filter((p) => p.slug !== post.slug)

  // Prefer explicitly listed related slugs, preserving their order.
  if (post.related && post.related.length > 0) {
    const explicit = post.related
      .map((slug) => all.find((p) => p.slug === slug))
      .filter((p): p is Post => Boolean(p))
    if (explicit.length > 0) return explicit.map(toMeta)
  }

  // Fall back to posts sharing the most tags.
  const tagSet = new Set(post.tags)
  return all
    .map((p) => ({
      post: p,
      shared: p.tags.filter((t) => tagSet.has(t)).length,
    }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map((x) => toMeta(x.post))
}

export function getAdjacentPosts(slug: string): {
  previous: PostMeta | null
  next: PostMeta | null
} {
  const posts = loadPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  if (index === -1) return { previous: null, next: null }

  // Posts are sorted newest first: "next" is the newer post, "previous" older.
  const next = index > 0 ? toMeta(posts[index - 1]) : null
  const previous = index < posts.length - 1 ? toMeta(posts[index + 1]) : null
  return { previous, next }
}
