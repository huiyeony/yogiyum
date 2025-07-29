import type { RestaurantCategory } from "@/entities/restaurant";

interface Props {
  category: RestaurantCategory;
}

interface BadgeUi {
  color: string;
  label: string;
}

export default function RestaurantCategoryBadge({ category }: Props) {
  const CATEGORY_BADGE_UI: { [key: string]: BadgeUi } = {
    Korean: { color: "bg-lime-400", label: "한식" },
    Western: { color: "bg-orange-400", label: "양식" },
    Asia: { color: "", label: "아시아음식" },
    Japanese: { color: "bg-red-400", label: "일식" },
    Chinese: { color: "bg-sky-400", label: "중식" },
    Street: { color: "", label: "분식" },
    Cafe: { color: "bg-stone-400", label: "카페" },
    Buffet: { color: "", label: "뷔페" },
    Dessert: { color: "", label: "디저트" },
    Bakery: { color: "", label: "빵집" },
    Etc: { color: "bg-gray-400", label: "기타" },
  };

  const selected = CATEGORY_BADGE_UI[category];

  return (
    <span
      className={`rounded-sm w-fit px-2 py-[2px] text-xs font-medium ${selected.color ?? "bg-gray-300"}`}
    >
      {selected.label}
    </span>
  );
}
