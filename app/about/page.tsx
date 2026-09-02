import type { Metadata } from "next"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "소개",
  description: `${siteConfig.author}와 이 블로그에 대한 소개입니다.`,
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="mb-3 font-mono text-sm text-primary">{"$ cat about.md"}</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">소개</h1>
      </header>

      <div className="prose-content">
        <p>
          안녕하세요, {siteConfig.author}입니다. 웹 개발과 프론트엔드 엔지니어링을
          다루는 개인 기술 블로그입니다. 새로 배운 것, 삽질한 것, 그리고 다시
          찾아보게 될 것들을 기록으로 남깁니다.
        </p>

        <h2>주로 다루는 주제</h2>
        <ul>
          <li>Next.js와 React 기반의 프론트엔드 아키텍처</li>
          <li>TypeScript와 타입 안정성</li>
          <li>개발 환경과 생산성 도구</li>
        </ul>

        <h2>이 블로그는</h2>
        <p>
          별도의 CMS 없이 Markdown 파일만으로 운영됩니다. 모든 글은 Git으로 버전
          관리되며, 빌드 시점에 정적 페이지로 생성됩니다.
        </p>

        <h2>연락</h2>
        <p>
          궁금한 점이나 피드백은{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> 또는{" "}
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          으로 보내 주세요.
        </p>
      </div>
    </div>
  )
}
