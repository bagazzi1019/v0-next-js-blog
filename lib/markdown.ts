import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeSlug from "rehype-slug"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import GithubSlugger from "github-slugger"
import type { TocItem } from "@/types/post"

// Raw HTML in the Markdown source is NOT passed through: remark-rehype drops it
// by default (allowDangerousHtml is off), so embedded <script> etc. never runs.
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}

// Build a table of contents from ATX headings (## and ###), matching the ids
// that rehype-slug generates so anchor links line up.
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger()
  const items: TocItem[] = []
  const lines = markdown.split("\n")
  let inCodeBlock = false

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = /^(#{2,3})\s+(.*)$/.exec(line)
    if (!match) continue

    const level = match[1].length
    const text = match[2].replace(/[#*`_]/g, "").trim()
    items.push({ id: slugger.slug(text), text, level })
  }

  return items
}

export function calculateReadingTime(content: string): number {
  // Count CJK characters and non-CJK words separately for a realistic estimate.
  const cjkChars = (content.match(/[\u3131-\uD79D\u4E00-\u9FFF]/g) || []).length
  const words = content
    .replace(/[\u3131-\uD79D\u4E00-\u9FFF]/g, "")
    .split(/\s+/)
    .filter(Boolean).length

  const minutes = cjkChars / 500 + words / 200
  return Math.max(1, Math.round(minutes))
}

export function createExcerpt(content: string, length = 160): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~-]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  return plain.length > length ? plain.slice(0, length).trimEnd() + "…" : plain
}
