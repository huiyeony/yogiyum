import { useState } from "react";

const emojiList = ["🍙", "🍱", "🍔", "🍜", "🥘", "🍰"];

interface EmojiButtonProps {
  className?: string;
}

export default function EmojiButton({ className }: EmojiButtonProps) {
  const [emojiIndex, setEmojiIndex] = useState<number>(0);

  const handleClickEmoji = () => {
    setEmojiIndex((prev) => (prev + 1) % emojiList.length);
  };

  return (
    <button
      onClick={handleClickEmoji}
      className={`text-3xl text-[#e4573d] animate-bounce hover:scale-125 hover:text-[#ff5630] hover:drop-shadow transition-all duration-300 focus:outline-none ${className}`}
    >
      {emojiList[emojiIndex]}
    </button>
  );
}
