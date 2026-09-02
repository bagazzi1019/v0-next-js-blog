import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/lib/site"

const navItems = [
  { href: "/", label: "홈" },
  { href: "/posts", label: "글" },
  { href: "/tags", label: "태그" },
  { href: "/about", label: "소개" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-base font-bold tracking-tight text-foreground"
        >
          {siteConfig.name}
          <span className="text-primary">.</span>
        </Link>

        <nav aria-label="주요 메뉴" className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
