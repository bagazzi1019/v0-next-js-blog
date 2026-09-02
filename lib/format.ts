export function formatDate(date: string): string {
  if (!date) return ""
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d)
}

export function formatDateISO(date: string): string {
  if (!date) return ""
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toISOString()
}
