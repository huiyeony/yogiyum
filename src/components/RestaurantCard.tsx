import { Heart } from "lucide-react";
import { Card } from "./ui/card";
import type { Restaurant } from "@/entities/restaurant";
import RestaurantCategoryBadge from "./RestaurantCategoryBadge";
import RatingStar from "./RatingStar";

interface Props {
  readonly restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Card className="flex flex-row justify-between p-4">
      {/* 이미지 부분 */}
      <div className="h-40 aspect-square">
        <img src={restaurant.thumbnailUrl.toString()} className="rounded-sm" />
      </div>

      {/* 카드 메인 부분 */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center justify-start">
          <h2 className="text-2xl font-bold">{restaurant.name}</h2>

          <RestaurantCategoryBadge category={restaurant.category} />
        </div>

        <div className="flex flex-col gap-4">
          {/* 별점 부분 */}
          <RatingStar rating={3.8} digit={1} />
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
