import { useEffect, useRef, useState } from "react";

const emojiList = ["🍙", "🍱", "🍔", "🍜", "🥘", "🥐", "🌭", "🍛", "🍨"];

interface EmojiProps {
  className?: string;
  intervalMs?: number;
}

export default function EmojiSwapper({
  className,
  intervalMs = 3000,
}: EmojiProps) {
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // 2초마다 페이드아웃 → 인덱스 변경 → 페이드인
    intervalRef.current = window.setInterval(() => {
      setVisible(false); // fade-out 시작
      timeoutRef.current = window.setTimeout(() => {
        setEmojiIndex((prev) => (prev + 1) % emojiList.length);
        setVisible(true); // fade-in
      }, 140); // out 애니메이션 시간(아래 duration-150과 맞춤)
    }, intervalMs);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [intervalMs]);

  return (
    <div
      aria-hidden
      className={[
        // 기본 스타일
        "text-3xl text-[#e4573d] animate-bounce select-none",
        // 호버
        "hover:scale-125 hover:text-[#ff5630] hover:drop-shadow",
        // 전환(부드럽게 페이드/스케일)
        "transition-all duration-300",
        className ?? "",
      ].join(" ")}
    >
      <span
        key={emojiIndex}
        className={[
          "inline-block transition-all",
          // out/in 타이밍: out 150ms, in 300ms(조금 더 길게 자연스럽게)
          visible
            ? "opacity-100 scale-100 duration-300"
            : "opacity-0 scale-95 rotate-[-4deg] duration-150",
        ].join(" ")}
      >
        {emojiList[emojiIndex]}
      </span>
    </div>
  );
}
