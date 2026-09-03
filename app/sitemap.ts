import type { MetadataRoute } from "next"
import { getAllPosts, getAllTags } from "@/lib/posts"
import { getSiteUrl } from "@/lib/site"
import { tagSlug } from "@/components/tag-badge"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const posts = getAllPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/posts`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tags`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/posts/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${base}/tags/${tagSlug(tag)}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }))

  return [...staticRoutes, ...postRoutes, ...tagRoutes]
}
