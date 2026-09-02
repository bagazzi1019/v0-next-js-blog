import Link from "next/link"
import { siteConfig } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          {"© "}
          {new Date().getFullYear()} {siteConfig.author}. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/rss.xml"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            RSS
          </Link>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
