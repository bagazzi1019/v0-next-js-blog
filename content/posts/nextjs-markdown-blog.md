---
title: "Next.js로 Markdown 블로그 만들기"
description: "Next.js App Router에서 파일 시스템 기반 Markdown 블로그를 만드는 전체 과정을 정리합니다."
date: "2026-09-01"
updated: "2026-09-02"
tags:
  - Next.js
  - Markdown
  - TypeScript
coverImage: "/images/posts/nextjs-markdown.png"
slug: "nextjs-markdown-blog"
related:
  - "typescript-project-setup"
  - "nextjs-seo-guide"
  - "prompt-engineering-guide"
---

정적인 콘텐츠를 다루는 개인 블로그라면 굳이 데이터베이스나 CMS가 필요하지 않습니다.
이 글에서는 **Next.js App Router**와 로컬 Markdown 파일만으로 완성도 높은 블로그를 만드는 방법을 정리합니다.

## 왜 Markdown 기반인가

Markdown 기반 블로그는 다음과 같은 장점이 있습니다.

- 글이 곧 파일이라 **Git으로 버전 관리**가 됩니다.
- 빌드 시점에 정적 페이지로 생성되어 **빠르고 저렴**합니다.
- 외부 서비스 의존성이 없어 **이식성**이 뛰어납니다.

> 콘텐츠가 코드 저장소 안에 있으면, 배포 파이프라인이 곧 발행 파이프라인이 됩니다.

## 콘텐츠 구조

각 글은 `content/posts` 디렉터리 아래에 하나의 `.md` 파일로 저장합니다.
파일 상단의 frontmatter로 메타데이터를 관리합니다.

| 필드 | 설명 |
| --- | --- |
| `title` | 글 제목 |
| `description` | 요약 및 메타 설명 |
| `date` | 작성일 |
| `tags` | 태그 목록 |
| `related` | 연관 글 slug |

## 파일 읽기 로직

Node.js의 `fs`와 `path`를 사용해 서버에서 파일을 읽습니다.
클라이언트 컴포넌트에서는 파일 시스템에 접근할 수 없다는 점을 기억하세요.

```ts
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export function getAllPosts() {
  const dir = path.join(process.cwd(), "content", "posts")
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8")
      const { data, content } = matter(raw)
      return { ...data, content }
    })
}
```

`gray-matter`가 frontmatter를 파싱해 주므로 메타데이터와 본문을 손쉽게 분리할 수 있습니다.

## Markdown 렌더링

본문은 `unified` 파이프라인으로 HTML로 변환합니다.
`remark-gfm`으로 표와 체크리스트 같은 GitHub 확장 문법을 지원하고,
raw HTML은 기본적으로 실행되지 않도록 안전하게 처리합니다.

인라인 코드는 `const answer = 42` 처럼 표시되고, 코드 블록은 syntax highlighting이 적용됩니다.

## 정적 생성

동적 라우트에 `generateStaticParams()`를 적용하면 모든 글이 빌드 시점에 미리 생성됩니다.

```tsx
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}
```

## 다음 단계

프로젝트 기본 설정이 궁금하다면 [TypeScript 프로젝트 설정](/posts/typescript-project-setup) 글을,
검색 노출을 챙기고 싶다면 [Next.js SEO 가이드](/posts/nextjs-seo-guide) 글을 이어서 읽어 보세요.
