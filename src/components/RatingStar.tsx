import React from "react";
import { Star } from "lucide-react";

interface Props {
  rating: number; // 평점
  size?: number; // 별 크기
  digit?: number; // 평점 소수점 자리수
  showScore?: boolean; // 숫자 점수도 같이 보여줄지
}

export default function RatingStar({
  rating,
  size = 20,
  digit = 1,
  showScore = true,
}: Props) {
  const fill = "#facc15";
  const borderColor = "#71717a";

  const fullStars = Math.floor(rating);
  const fractional = rating - fullStars;

  const renderStar = (index: number) => {
    if (index < fullStars) {
      // 다 채워진 별
      return (
        <Star
          key={index}
          size={size}
          fill={fill}
          color={borderColor}
          strokeWidth={1.5}
        />
      );
    } else if (index === fullStars && fractional > 0) {
      // 비율로 채워진 별
      return (
        <div
          key={index}
          style={{ width: size, height: size, position: "relative" }}
        >
          {/* absolute 을 통해 정확히 별 두개를 같은 위치에 그리기 */}
          <Star
            size={size}
            color={borderColor}
            strokeWidth={1.5}
            className="absolute top-0 left-0"
          />

          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{
              // 소숫점 비율을 백분율로 전환하고 width  설정
              width: `${fractional * 100}%`,
              height: "100%",
            }}
          >
            <Star
              size={size}
              fill={fill}
              color={borderColor}
              strokeWidth={1.5}
            />
          </div>
        </div>
      );
    } else {
      // 아예 빈 별
      return (
        <Star key={index} size={size} color={borderColor} strokeWidth={1.5} />
      );
    }
  };

  return (
    <div className="flex flex-row gap-2 items-end">
      <div className="flex flex-row gap-[2px]">
        {Array.from({ length: 5 }).map((_, index) => renderStar(index))}
      </div>
      {showScore && (
        <span className="text-neutral-500 text-xs">{`(${rating.toFixed(digit)})`}</span>
      )}
    </div>
  );
}
