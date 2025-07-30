// categoryMap, CategoryLabel은 그대로 사용
export const categoryMap = {
  한식: { emoji: "🍚", color: "bg-lime-400" },
  양식: { emoji: "🍝", color: "bg-blue-400" },
  일식: { emoji: "🍣", color: "bg-pink-400" },
  중식: { emoji: "🍜", color: "bg-red-400" },
  카페: { emoji: "☕", color: "bg-purple-400" },
} as const;

export type CategoryLabel = keyof typeof categoryMap;

// 1) 타입 가드
const isCategoryLabel = (v: string): v is CategoryLabel =>
  Object.prototype.hasOwnProperty.call(categoryMap, v);

// 2) 번역 함수가 반드시 CategoryLabel을 반환하도록
export function translateCategory(input: unknown): CategoryLabel {
  const raw = typeof input === "string" ? input.trim() : "";

  // 영문/기타 → 한글 라벨 매핑(필요에 맞게 보강하세요)
  const map: Record<string, CategoryLabel> = {
    korean: "한식",
    "korean food": "한식",
    japanese: "일식",
    chinese: "중식",
    western: "양식",
    cafe: "카페",

    // 이미 한글 라벨로 들어오는 경우도 허용
    한식: "한식",
    일식: "일식",
    중식: "중식",
    양식: "양식",
    카페: "카페",
  };

  const key = raw.toLowerCase();
  const candidate = map[key] ?? (raw as string);

  if (isCategoryLabel(candidate)) return candidate;

  // 마지막 안전장치(미분류 시 기본값)
  return "카페";
}
