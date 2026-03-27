export function toISODate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatKoreanDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map((v) => Number(v));
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(dt);
}

export function addDays(isoDate: string, delta: number): string {
  const [y, m, d] = isoDate.split("-").map((v) => Number(v));
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return toISODate(dt);
}

export function compareIsoDateDesc(a: string, b: string): number {
  if (a === b) return 0;
  return a > b ? -1 : 1;
}

export function clampIntensity(v: number): 1 | 2 | 3 | 4 | 5 {
  if (v <= 1) return 1;
  if (v >= 5) return 5;
  return Math.round(v) as 1 | 2 | 3 | 4 | 5;
}

