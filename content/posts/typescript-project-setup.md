---
title: "실용적인 TypeScript 프로젝트 설정"
description: "새 프로젝트를 시작할 때 반복적으로 하게 되는 TypeScript 설정을 체크리스트로 정리했습니다."
date: "2026-08-24"
updated: "2026-08-25"
tags:
  - TypeScript
  - 개발환경
coverImage: "/images/posts/typescript-setup.png"
slug: "typescript-project-setup"
related:
  - "nextjs-markdown-blog"
  - "prompt-engineering-guide"
---

새 프로젝트를 만들 때마다 비슷한 설정을 반복하게 됩니다.
이 글에서는 **타입 안정성**과 **개발 편의성**을 모두 챙기는 TypeScript 기본 설정을 정리합니다.

## tsconfig의 핵심 옵션

무작정 옵션을 켜기보다, 각 옵션이 무엇을 막아 주는지 이해하는 것이 중요합니다.

1. `strict` — 모든 엄격 검사 플래그를 한 번에 켭니다.
2. `noUncheckedIndexedAccess` — 인덱스 접근 결과를 `undefined` 가능성으로 다룹니다.
3. `moduleResolution: "bundler"` — 최신 번들러 환경에 맞춘 해석 방식입니다.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "skipLibCheck": true
  }
}
```

> `strict`를 처음부터 켜 두면, 나중에 켜면서 밀려드는 수백 개의 에러를 마주할 일이 없습니다.

## 경로 별칭

상대 경로가 길어지면 리팩터링이 어려워집니다.
`paths`로 별칭을 지정해 두면 import 구문이 훨씬 읽기 쉬워집니다.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

이제 `import { getAllPosts } from "@/lib/posts"` 처럼 안정적인 경로를 사용할 수 있습니다.

## 타입 우선 설계

- 함수의 입력과 출력 타입을 먼저 정의합니다.
- `any` 대신 `unknown`을 쓰고 좁혀 나갑니다.
- 공용 타입은 `types/` 디렉터리에 모아 재사용합니다.

## 마무리

기본기가 탄탄하면 이후 작업이 훨씬 수월합니다.
이 설정 위에서 블로그를 만드는 과정은 [Next.js로 Markdown 블로그 만들기](/posts/nextjs-markdown-blog)에서 이어집니다.
