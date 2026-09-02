"use client"

import * as React from "react"
import type { TocItem } from "@/types/post"
import { cn } from "@/lib/utils"

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    if (items.length === 0) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="목차" className="text-sm">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        목차
      </p>
      <ul className="flex flex-col gap-1 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 leading-snug transition-colors",
                item.level === 3 ? "pl-6" : "pl-3",
                activeId === item.id
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
