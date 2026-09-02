# devlog — Markdown 기술 블로그

Next.js App Router 기반의 파일 시스템 Markdown 블로그입니다. 데이터베이스나 CMS 없이
`content/posts` 디렉터리의 `.md` 파일만으로 운영됩니다.

## 주요 기능

- Markdown(GFM) 렌더링 + 코드 syntax highlighting
- frontmatter 기반 메타데이터
- 태그별 분류 및 태그 페이지
- 클라이언트 검색 / 태그 필터
- 자동 목차(TOC)와 스크롤 스파이
- 연관 글 / 이전·다음 글 네비게이션
- 다크 모드
- SEO: Metadata API(Open Graph, Twitter Card), JSON-LD, `sitemap.xml`, `robots.txt`, `rss.xml`
- 예상 읽기 시간(한글/영문 혼합 지원)

## 새 글 작성하기

`content/posts/` 아래에 `.md` 파일을 추가하고 상단에 frontmatter를 작성합니다.

```md
---
title: "글 제목"
description: "요약 및 메타 설명"
date: "2026-09-01"
updated: "2026-09-02"        # 선택
tags:
  - Next.js
  - TypeScript
coverImage: "/images/posts/cover.png"   # 선택
slug: "my-post-slug"          # 선택 (없으면 파일명 사용)
related:                      # 선택 (연관 글 slug)
  - "another-post-slug"
---

여기에 본문을 Markdown으로 작성합니다.
```

### 필드 설명

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `title` | ✓ | 글 제목 |
| `description` | ✓ | 요약 및 메타 설명 |
| `date` | ✓ | 작성일 (`YYYY-MM-DD`) |
| `updated` | | 수정일 |
| `tags` | | 태그 목록 |
| `coverImage` | | 대표 이미지 경로 (`public` 기준) |
| `slug` | | URL slug (미지정 시 파일명) |
| `related` | | 연관 글 slug 목록. 없으면 태그 기반으로 자동 추천 |

글은 `date` 기준 최신순으로 자동 정렬됩니다.

## 환경 변수

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 (사이트맵·RSS·OG URL 생성에 사용). 미설정 시 `http://localhost:3000` |

## 설정 변경

블로그 이름, 소개, 작성자 등은 `lib/site.ts`에서 수정합니다.

## 개발

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
```
