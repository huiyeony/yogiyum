import { Star, StarHalf } from "lucide-react";

interface Props {
  rating: number;
  size?: number;
  digit?: number;
  showScore?: boolean;
}

export default function RatingStar({
  rating,
  size = 20,
  digit = 1,
  showScore = true,
}: Props) {
  const fill = "#facc15";
  const strokeWidth = 1.5;
  const borderColor = "#71717a";

  return (
    <div className="flex flex-row gap-1">
      {new Array(5).fill(0).map((_, index) => {
        if (rating - index >= 1) {
          return (
            <Star
              size={size}
              key={index}
              fill={fill}
              color={borderColor}
              strokeWidth={strokeWidth}
            />
          );
        } else if (rating - index < 1 && rating - index > 0) {
          return (
            <StarHalf
              size={size}
              key={index}
              fill={fill}
              color={borderColor}
              strokeWidth={strokeWidth}
            />
          );
        } else {
          return (
            <Star
              size={size}
              key={index}
              strokeWidth={strokeWidth}
              color={borderColor}
            />
          );
        }
      })}

      <span className="text-neutral-500 text-sm">
        {showScore ? rating.toFixed(digit) : ""}
      </span>
    </div>
  );
}
