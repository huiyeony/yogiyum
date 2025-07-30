// src/constants/categoryMap.ts

export const categoryMap = {
  한식: { emoji: "🍚", color: "bg-lime-400" }, // Green
  양식: { emoji: "🍝", color: "bg-orange-400" }, // Orange
  일식: { emoji: "🍣", color: "bg-pink-400" }, // Pink
  중식: { emoji: "🍜", color: "bg-red-400" }, // Red
  카페: { emoji: "☕", color: "bg-purple-400" }, // Purple
  빵집: { emoji: "🥖", color: "bg-blue-400" }, // Blue
} as const;

export type CategoryLabel = keyof typeof categoryMap;

export const allCategoryLabels = Object.keys(categoryMap) as CategoryLabel[];
