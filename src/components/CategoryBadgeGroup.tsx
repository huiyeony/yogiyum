import { useState } from "react";
import SmartCategoryBadge from "@/components/ui/SmartCategoryBadge";
import { categoryMap } from "@/constants/categoryMap";
import type { CategoryLabel } from "@/constants/categoryMap";

interface Props {
  onChange?: (selected: CategoryLabel[]) => void;
}

export default function CategoryBadgeGroup({ onChange }: Props) {
  const allLabels = Object.keys(categoryMap) as CategoryLabel[];
  const [selected, setSelected] = useState<CategoryLabel[]>(allLabels);

  const toggleCategory = (label: CategoryLabel) => {
    const isSelected = selected.includes(label);
    const next = isSelected
      ? selected.filter((x) => x !== label)
      : [...selected, label];
    setSelected(next);
    onChange?.(next);
  };

  const handleToggleAll = () => {
    const next = selected.length === allLabels.length ? [] : allLabels;
    setSelected(next);
    onChange?.(next);
  };

  const isAllSelected = selected.length === allLabels.length;
  const toggleButtonText = isAllSelected ? "모두 제거🚫" : "모두 선택✅";

  return (
    <div>
      {/* 배지 + 버튼을 같은 플로우에 두고 줄바꿈 허용 */}
      <div className="flex flex-wrap items-center gap-2">
        {allLabels.map((label) => (
          <SmartCategoryBadge
            key={label}
            label={label}
            disabled={!selected.includes(label)}
            onClick={() => toggleCategory(label)}
            size="md"
          />
        ))}

        {/* 토글 버튼: 플로우에 섞여서 필요하면 다음 줄로 내려감 */}
        <button
          type="button"
          onClick={handleToggleAll}
          aria-pressed={isAllSelected}
          className="inline-flex px-3.5 py-2.5 text-sm font-['Gowun_Dodum'] bg-zinc-200 hover:bg-zinc-300 rounded-md shadow transition-all"
        >
          {toggleButtonText}
        </button>
      </div>
    </div>
  );
}
