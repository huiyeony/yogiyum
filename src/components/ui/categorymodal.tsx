import React from "react";

const categories = ["한식", "중식", "일식", "양식", "카페"];

export default function CategoryModal({
  selected,
  onChange,
  onClose,
  onClick,
}: {
  selected: string[];
  onChange: (value: string[]) => void;
  onClose: () => void;
  onClick: (e: React.MouseEvent) => void;
}) {
  const toggleCategory = (item: string) => {
    let next = [...selected];
    if (item === "전체") {
      next = ["전체"];
    } else {
      next = next.includes(item)
        ? next.filter((v) => v !== item)
        : [...next.filter((v) => v !== "전체"), item];
    }
    if (next.length === 0) next = ["전체"];
    onChange(next);
  };

  return (
    <div
      className="bg-white w-full max-w-[520px] rounded-t-xl p-4"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2 ml-1">카테고리 선택</h3>
      <div className="flex flex-wrap gap-3 mb-4">
        {["전체", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`px-3 py-1.5 rounded-full border ${
              selected.includes(cat)
                ? "bg-[#ffe4df] border-[#ff7043] text-[#ff7043]"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full bg-[#ff7043] text-white py-2 rounded-md font-semibold"
      >
        확인
      </button>
    </div>
  );
}
