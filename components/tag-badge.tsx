import Link from "next/link"
import { cn } from "@/lib/utils"

export function tagSlug(tag: string): string {
  return encodeURIComponent(tag.toLowerCase())
}

export function TagBadge({
  tag,
  count,
  active,
  asLink = true,
}: {
  tag: string
  count?: number
  active?: boolean
  asLink?: boolean
}) {
  const className = cn(
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
  )

  const content = (
    <>
      <span>{tag}</span>
      {typeof count === "number" && (
        <span className={cn(active ? "opacity-80" : "text-muted-foreground/70")}>
          {count}
        </span>
      )}
    </>
  )

  if (!asLink) {
    return <span className={className}>{content}</span>
  }

  return (
    <Link href={`/tags/${tagSlug(tag)}`} className={className}>
      {content}
    </Link>
  )
}
