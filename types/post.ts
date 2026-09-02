export interface PostFrontmatter {
  title: string
  description: string
  date: string
  updated?: string
  tags: string[]
  coverImage?: string
  slug: string
  related?: string[]
}

export interface PostMeta extends PostFrontmatter {
  readingTime: number
  excerpt: string
}

export interface Post extends PostMeta {
  content: string
}

export interface TocItem {
  id: string
  text: string
  level: number
}
