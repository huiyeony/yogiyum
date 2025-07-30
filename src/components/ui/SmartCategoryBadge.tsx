import { categoryMap } from "@/constants/categoryMap";
import type { CategoryLabel } from "@/constants/categoryMap";

interface Props {
  label: CategoryLabel;
  disabled: boolean; // 외부 상태 제어
  type?: "full" | "compact";
  /** 배지 크기 프리셋: xs(게시판용) | sm(기본) | md */
  size?: "xs" | "sm" | "md";
  onClick?: (label: CategoryLabel, newDisabled: boolean) => void; // ✅ label 전달
  width?: string; // 직접 지정하고 싶을 때
  height?: string; // 직접 지정하고 싶을 때
  className?: string;
}

export default function SmartCategoryBadge({
  label,
  disabled,
  type = "full",
  size = "xs", // ✅ 기본을 작게: 게시판 한 줄 배치에 최적화
  onClick,
  width,
  height = "h-auto",
  className = "",
}: Props) {
  const { emoji, color } = categoryMap[label];
  const grayscale = disabled ? "grayscale opacity-50" : "";
  const baseFont = "font-[jua] text-black";

  // ✅ 사이즈 프리셋 (한 줄 노출 최적화)
  const presets = {
    xs: {
      // 전체 배지 박스
      box: `rounded-md ${width ?? "w-[52px]"} ${height} px-1.5 py-1`,
      // 이모지 원
      circle: "w-6 h-6 text-base",
      // 이모지 아래 간격
      gap: "mb-0.5",
      // 라벨 폰트
      label: "text-[9px]",
      // hover 애니메이션 살짝만
      hover: "hover:scale-[1.03]",
    },
    sm: {
      box: `rounded-md ${width ?? "w-[64px]"} ${height} px-2 py-1.5`,
      circle: "w-7 h-7 text-lg",
      gap: "mb-1",
      label: "text-[10px]",
      hover: "hover:scale-105",
    },
    md: {
      box: `rounded-md ${width ?? "w-[72px]"} ${height} px-2.5 py-2`,
      circle: "w-8 h-8 text-xl",
      gap: "mb-1.5",
      label: "text-[11px]",
      hover: "hover:scale-105",
    },
  } as const;

  const S = presets[size];

  const toggle = () => {
    onClick?.(label, !disabled);
  };

  if (type === "compact") {
    // 텍스트만 배지 (필요 시)
    return (
      <div
        onClick={toggle}
        className={[
          "cursor-pointer rounded shadow",
          "transition-colors",
          color,
          baseFont,
          S.label,
          "px-2 py-1",
          grayscale,
          className,
        ].join(" ")}
        aria-pressed={!disabled}
        role="button"
      >
        {label}
      </div>
    );
  }

  return (
    <div
      onClick={toggle}
      className={[
        "cursor-pointer shadow transition-all",
        S.hover,
        "hover:shadow-md",
        S.box,
        "flex flex-col items-center justify-center text-[11px]",
        color,
        grayscale,
        className,
      ].join(" ")}
      aria-pressed={!disabled}
      role="button"
    >
      {/* 이모지 원형 흰 배경 */}
      <div
        className={[
          "rounded-full bg-white flex items-center justify-center",
          S.circle,
          S.gap,
        ].join(" ")}
      >
        {emoji}
      </div>

      {/* 카테고리 이름 */}
      <div className={[baseFont, S.label].join(" ")}>
        {<p className="font-['Gowun_Dodum']">{label}</p>}
      </div>
    </div>
  );
}
