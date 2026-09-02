export const siteConfig = {
  name: "devlog",
  title: "devlog — 개인 기술 블로그",
  description:
    "웹 개발과 프론트엔드 엔지니어링에 대한 기록. Next.js, TypeScript, 그리고 배운 것들을 정리합니다.",
  author: "Jaehyun Kim",
  github: "https://github.com/vercel",
  email: "hello@example.com",
  locale: "ko_KR",
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
}
