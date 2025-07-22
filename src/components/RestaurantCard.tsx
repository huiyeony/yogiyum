import { Heart, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export default function RestaurantCard() {
  return (
    <Card className="flex flex-row justify-between p-4">
      {/* 이미지 부분 */}
      <div className="h-40 aspect-square">
        <img src="https://picsum.photos/160" className="rounded-sm" />
      </div>

      {/* 카드 메인 부분 */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center justify-start">
          <h2 className="text-2xl font-bold">식당 이름</h2>

          <Badge>양식</Badge>

          <Badge variant="destructive">인기</Badge>
        </div>

        <div className="flex flex-col gap-4">
          {/* 별점 부분 */}
          <div className="flex flex-row items-center gap-1">
            <Star size="20" />
            <Star size="20" />
            <Star size="20" />
            <Star size="20" />
            <Star size="20" />

            <span className="text-neutral-500">4.5</span>
          </div>
        </div>
      </div>

      {/* 찜하기 버튼 부분 */}
      <div>
        <Heart fill="#ef4444" strokeWidth={0} size={40} />
        <span>124</span>
      </div>
    </Card>
  );
}
