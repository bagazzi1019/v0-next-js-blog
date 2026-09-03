---
title: "Next.js SEO 가이드: Metadata API 활용법"
description: "Next.js Metadata API로 Open Graph, 사이트맵, RSS까지 검색 최적화를 챙기는 방법을 다룹니다."
date: "2026-08-18"
tags:
  - Next.js
  - SEO
  - Markdown
coverImage: "/images/posts/nextjs-seo.png"
slug: "nextjs-seo-guide"
related:
  - "nextjs-markdown-blog"
  - "typescript-project-setup"
  - "prompt-engineering-guide"
---

콘텐츠가 아무리 좋아도 검색에 노출되지 않으면 읽히지 않습니다.
Next.js는 **Metadata API**를 통해 SEO 작업을 선언적으로 처리할 수 있게 해 줍니다.

## 페이지별 메타데이터

정적 메타데이터는 `metadata` 객체로, 동적 메타데이터는 `generateMetadata` 함수로 정의합니다.

```tsx
export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}
```

> App Router에서 `params`는 Promise이므로 반드시 `await`로 풀어야 합니다.

## Open Graph와 Twitter 카드

소셜 미디어 공유 시 보이는 카드 정보입니다.

- `openGraph.images` — 공유용 대표 이미지
- `twitter.card` — `summary_large_image` 권장
- `alternates.canonical` — 중복 콘텐츠 방지를 위한 정규 URL

## 사이트맵과 robots

Next.js는 파일 규약만으로 사이트맵과 robots를 생성합니다.

```ts
// app/sitemap.ts
export default function sitemap() {
  return getAllPosts().map((post) => ({
    url: `https://example.com/posts/${post.slug}`,
    lastModified: post.updated ?? post.date,
  }))
}
```

## RSS 피드

RSS는 여전히 유효한 구독 채널입니다.
Route Handler에서 XML 문자열을 만들어 반환하면 됩니다.

1. 모든 글을 최신순으로 정렬합니다.
2. 각 글을 `<item>` 요소로 변환합니다.
3. `Content-Type`을 `application/xml`로 설정해 응답합니다.

## 정리

메타데이터, 사이트맵, RSS는 한 번 설정해 두면 새 글마다 자동으로 반영됩니다.
블로그 전체 구조가 궁금하다면 [Next.js로 Markdown 블로그 만들기](/posts/nextjs-markdown-blog)를,
설정 기반이 궁금하다면 [TypeScript 프로젝트 설정](/posts/typescript-project-setup)을 참고하세요.
