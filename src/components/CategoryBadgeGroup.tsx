import { useState } from "react";
import SmartCategoryBadge from "@/components/ui/SmartCategoryBadge";
import { categoryMap } from "@/constants/categoryMap";
import type { CategoryLabel } from "@/constants/categoryMap";

interface Props {
  /** 선택 변경 콜백 */
  onChange?: (selected: CategoryLabel[]) => void;
  /** 컴포넌트 바깥 여백 등 커스터마이즈용 */
  className?: string;
}

export default function CategoryBadgeGroup({ onChange, className }: Props) {
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
    <div className={className}>
      {/* 한 줄 스크롤 배지 리스트 (토글버튼 + 카테고리) */}
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto py-1 pl-[5px]">
        {/* 토글 버튼 */}
        <button
          type="button"
          onClick={handleToggleAll}
          aria-pressed={isAllSelected}
          className="flex-none inline-flex items-center justify-center 
            rounded-md w-[72px] h-17 px-2.5 py-2 text-[13px] font-['Gowun_Dodum'] 
            shadow bg-zinc-200 hover:bg-zinc-300 transition-transform hover:scale-105"
        >
          {toggleButtonText}
        </button>

        {/* 카테고리 뱃지들 */}
        {allLabels.map((label) => (
          <div key={label} className="flex-none">
            <SmartCategoryBadge
              label={label}
              disabled={!selected.includes(label)}
              onClick={() => toggleCategory(label)}
              size="md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
