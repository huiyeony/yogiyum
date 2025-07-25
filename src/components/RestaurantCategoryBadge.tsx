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
    Korean: { color: "", label: "한식" },
    Western: { color: "", label: "양식" },
    Asia: { color: "", label: "아시아음식" },
    Japanese: { color: "", label: "일식" },
    Chinese: { color: "", label: "중식" },
    Street: { color: "", label: "분식" },
    Cafe: { color: "", label: "카페" },
    Buffet: { color: "", label: "뷔페" },
    Dessert: { color: "", label: "디저트" },
    Etc: { color: "", label: "기타" },
  };

  const selected = CATEGORY_BADGE_UI[category];

  return (
    <span className="rounded-md w-fit px-2 py-1 text-xs font-medium bg-accent-foreground text-accent">
      {selected.label}
    </span>
  );
}
