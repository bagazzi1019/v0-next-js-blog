import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-xl font-bold tracking-tight">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        요청하신 페이지가 이동되었거나 존재하지 않습니다.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
