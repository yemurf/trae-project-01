export type KeywordStat = { term: string; count: number };

function normalizeText(text: string): string {
  let safe = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    safe += code < 32 ? " " : text[i];
  }

  return safe
    .replace(/[0-9]/g, " ")
    .replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isMostlyHangul(term: string): boolean {
  const hangul = term.match(/[가-힣]/g)?.length ?? 0;
  return hangul >= Math.max(1, Math.floor(term.length * 0.6));
}

export function extractTopKeywords(texts: string[], limit: number): KeywordStat[] {
  const stop = new Set([
    "그리고",
    "그래서",
    "그냥",
    "오늘",
    "내일",
    "어제",
    "진짜",
    "너무",
    "정말",
    "근데",
    "하지만",
    "있다",
    "없다",
    "했다",
    "하는",
    "되는",
    "같다",
    "같은",
    "나는",
    "내가",
    "우리",
    "저는",
  ]);

  const counts = new Map<string, number>();
  for (const raw of texts) {
    const normalized = normalizeText(raw);
    if (!normalized) continue;

    const parts = normalized.split(" ");
    for (const p of parts) {
      const term = p.trim();
      if (term.length < 2) continue;
      if (stop.has(term)) continue;
      if (!isMostlyHangul(term)) continue;

      counts.set(term, (counts.get(term) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.term.localeCompare(b.term)))
    .slice(0, limit);
}
