# 프로젝트 아키텍처

## 개요

이 프로젝트는 Next.js App Router 기반의 파일 시스템 Markdown 기술 블로그다. 별도 데이터베이스나 CMS 없이 `content/posts/`의 Markdown 파일을 콘텐츠 원본으로 사용하며, 서버 컴포넌트가 빌드 또는 요청 시 파일을 읽어 페이지를 생성한다.

## 기술 스택

- Next.js 16.3.3, React 19, TypeScript
- Tailwind CSS 4와 전역 CSS
- `gray-matter`: Markdown frontmatter 파싱
- Unified/Remark/Rehype: GFM 변환, 제목 ID, 코드 하이라이팅, HTML 직렬화
- `next-themes`: 라이트·다크 테마
- Vercel Analytics
- pnpm: 패키지 및 잠금 파일 관리

## 주요 디렉터리

```text
app/                    App Router 페이지, 레이아웃, 메타데이터 엔드포인트
  posts/[slug]/         개별 게시글 동적 경로
  tags/[tag]/           태그별 게시글 동적 경로
  rss.xml/              RSS Route Handler
components/             재사용 UI와 클라이언트 상호작용 컴포넌트
  ui/                   공통 UI 기본 요소
content/posts/          frontmatter가 포함된 Markdown 게시글 원본
lib/                    콘텐츠 로딩, Markdown 변환, 포맷, 사이트 설정
public/                 아이콘과 게시글 대표 이미지 등 정적 자산
types/                  게시글과 목차의 공유 TypeScript 타입
```

## 라우트 구조

- `/`: 최신 게시글 5개와 주요 태그를 표시한다.
- `/posts`: 전체 게시글을 표시하며 `PostsExplorer`에서 검색과 태그 필터링을 처리한다.
- `/posts/[slug]`: Markdown 본문, 목차, 관련 글, 이전·다음 글을 렌더링한다.
- `/tags`: 전체 태그와 게시글 수를 표시한다.
- `/tags/[tag]`: 선택한 태그에 해당하는 게시글을 표시한다.
- `/about`: 작성자와 블로그 소개를 표시한다.
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`: 검색 엔진과 피드 리더용 출력을 제공한다.

## 콘텐츠 데이터 흐름

```text
content/posts/*.md
  → lib/posts.ts: 파일 읽기 및 frontmatter 파싱
  → types/post.ts: Post/PostMeta 데이터 모델
  → lib/markdown.ts: Markdown HTML 변환, 목차·읽기 시간·요약 생성
  → app/* 및 components/*: 목록과 상세 페이지 렌더링
```

`lib/posts.ts`는 실행 프로세스 안에서 게시글을 한 번 읽고 메모리에 캐시한다. 게시글은 `date` 기준 최신순으로 정렬된다. 관련 글은 frontmatter의 `related`를 우선 사용하고, 없으면 공통 태그 수를 기준으로 추천한다.

## 렌더링 경계

- 페이지와 콘텐츠 로더는 기본적으로 서버 컴포넌트다.
- `PostsExplorer`, `TableOfContents`, `ThemeToggle`, `ThemeProvider`는 브라우저 상태나 DOM 동작이 필요해 클라이언트 컴포넌트로 동작한다.
- 동적 게시글과 태그 경로는 `generateStaticParams`로 알려진 항목을 사전 생성한다.
- 존재하지 않는 게시글이나 태그는 `notFound()`를 통해 404 페이지로 이동한다.

## Markdown 처리와 보안

`lib/markdown.ts`는 Remark로 Markdown/GFM을 파싱하고 Rehype로 HTML을 생성한다. 원시 HTML 허용 옵션을 사용하지 않으므로 Markdown 안의 `<script>` 같은 원시 HTML은 실행 가능한 출력으로 전달되지 않는다. `rehype-slug`와 `github-slugger`가 본문 제목과 목차의 앵커 ID를 일치시킨다.

## 사이트 설정과 SEO

- 사이트 이름, 작성자, GitHub, 이메일, 로케일은 `lib/site.ts`에서 관리한다.
- 배포 URL은 `NEXT_PUBLIC_SITE_URL`을 사용하고, 없으면 `http://localhost:3000`을 사용한다.
- 루트 및 게시글 메타데이터, Open Graph, Twitter Card, canonical URL을 Next.js Metadata API로 생성한다.
- 게시글 상세 페이지는 `BlogPosting` JSON-LD를 출력한다.
- `app/sitemap.ts`, `app/robots.ts`, `app/rss.xml/route.ts`가 검색·구독용 문서를 생성한다.

## 스타일과 UI

- 전역 토큰과 본문 타이포그래피는 `app/globals.css`에 있다.
- 공통 레이아웃은 `app/layout.tsx`가 헤더, 본문, 푸터, 테마 공급자, Analytics를 조합한다.
- 경로 별 UI는 `components/`의 카드, 태그 배지, 목차, 검색·필터 컴포넌트를 재사용한다.
- `@/*` 별칭은 프로젝트 루트를 가리킨다.

## 개발 명령

```bash
pnpm dev
pnpm build
pnpm start
```

기본 개발 서버 주소는 `http://localhost:3000`이다. 현재 `next.config.mjs`는 이미지 최적화를 끄고 TypeScript 빌드 오류를 무시하도록 설정되어 있으므로, 변경 후에는 별도로 타입 검사를 수행하는 것이 안전하다.

## GitHub Pages 배포

- `next.config.mjs`는 `output: "export"`를 사용해 `out/`에 정적 사이트를 생성한다.
- GitHub Actions에서는 `NEXT_PUBLIC_BASE_PATH=/v0-next-js-blog`를 주입해 프로젝트 Pages 하위 경로를 처리한다.
- `next/link` 경로에는 Next.js가 `basePath`를 자동 적용하며, `next/image`의 로컬 자산에는 `lib/site.ts`의 `withBasePath()`를 적용한다.
- `.github/workflows/deploy-pages.yml`은 `deploy` 브랜치 push와 수동 실행에서만 동작한다.
- 워크플로는 pnpm으로 설치 및 빌드한 뒤 `out/`을 Pages artifact로 배포한다.
- 빌드는 샌드박스 및 CI 환경에서 예측 가능한 `next build --webpack`을 사용하며, RSS·사이트맵·robots 메타데이터 라우트는 정적으로 생성한다.
- GitHub 저장소의 Pages Source는 `GitHub Actions`로 설정해야 한다.

## 변경 시 주의사항

- 새 글은 `content/posts/`에 `.md` 파일로 추가하고 필수 frontmatter인 `title`, `description`, `date`를 작성한다.
- `slug`를 바꾸면 게시글 URL과 `related` 참조도 함께 확인한다.
- Markdown 로더는 프로세스 메모리 캐시를 사용하므로 개발 중 콘텐츠 변경이 즉시 반영되지 않으면 개발 서버를 재시작한다.
- 사이트 정체성이나 배포 주소를 변경할 때는 `lib/site.ts`와 `NEXT_PUBLIC_SITE_URL`을 함께 확인한다.
- Next.js 16 관련 코드를 수정하기 전에는 루트 `AGENTS.md`에 안내된 로컬 Next.js 문서를 우선 확인한다.
