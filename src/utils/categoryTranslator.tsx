// 사용자가 제공한 매핑
export const KO_TO_EN = {
  한식: "Korean",
  중식: "Chinese",
  일식: "Japanese",
  양식: "Western",
  카페: "Cafe",
} as const;

type KoKey = keyof typeof KO_TO_EN;
type EnVal = (typeof KO_TO_EN)[KoKey];

// 역매핑 (영 → 한)
export const EN_TO_KO: Record<string, KoKey> = Object.entries(KO_TO_EN).reduce(
  (acc, [ko, en]) => {
    acc[en.toLowerCase()] = ko as KoKey;
    return acc;
  },
  {} as Record<string, KoKey>
);

function normalize(input: string) {
  return (input ?? "").trim();
}

/** 한글 → 영어 (없으면 undefined) */
export function toEnglish(input: string): EnVal | undefined {
  const key = normalize(input) as KoKey;
  return KO_TO_EN[key];
}

/** 영어 → 한글 (없으면 undefined) */
export function toKorean(input: string): KoKey | undefined {
  const key = normalize(input).toLowerCase();
  return EN_TO_KO[key];
}

/**
 * 자동 변환: 한글이면 영어, 영어면 한글
 * - fallback: 변환 실패 시 반환할 값 (기본은 원본 그대로)
 */
export function translateCategory(
  input: string,
  options?: { fallback?: string }
): string {
  const clean = normalize(input);
  if (!clean) return options?.fallback ?? "";

  // 한글 키인지 먼저 확인
  const en = toEnglish(clean);
  if (en) return en;

  // 영어 값인지 확인 (대소문자 무관)
  const ko = toKorean(clean);
  if (ko) return ko;

  // 매핑에 없으면 폴백
  return options?.fallback ?? clean;
}
