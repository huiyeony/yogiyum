import { useState } from "react";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Restaurant } from "@/entities/restaurant";
import RestaurantCategoryBadge from "@/components/RestaurantCategoryBadge";
import RatingStar from "@/components/RatingStar";
import supabase from "@/lib/supabase";
import { Link } from "react-router-dom";

interface Props {
  readonly restaurant: Restaurant;
  readonly rating?: number;
  readonly likedCount: number;
  readonly isLiked: boolean;
  onSearch: () => void;
}

export default function RestaurantCard({
  restaurant,
  rating,
  likedCount = 0,
  isLiked,
  onSearch,
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const likedButtonClick = () => {
    if (isLiked) {
      supabase
        .from("liked")
        .delete()
        .eq("restaurant_id", restaurant.id)
        .then((res) => {
          if (res.status <= 200 || res.status > 300) return;
          onSearch();
        });
    } else {
      supabase
        .from("liked")
        .insert({ restaurant_id: restaurant.id })
        .then((res) => {
          if (res.status <= 200 || res.status > 300) return;
          onSearch();
        });
    }
  };

  return (
    <Card className="w-full relative flex flex-col rounded-xl overflow-hidden bg-[#fffaf6] transition-transform duration-100 hover:scale-[1.02]">
      {/* 좋아요 버튼 */}
      <div className="absolute top-1.5 right-1.5 z-10 flex flex-col items-center bg-white rounded-full shadow p-1">
        <Heart
          className="cursor-pointer"
          fill={isLiked ? "#ef4444" : "gray"}
          strokeWidth={0}
          size={20}
          onClick={likedButtonClick}
        />
        <span className="text-[10px] text-gray-500 mt-0.5">{likedCount}</span>
      </div>

      {/* 이미지 영역 */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 mt-1">
        {!imageLoaded && (
          <img
            src="/loading.gif"
            alt="로딩 중"
            className="absolute inset-0 w-full h-full object-contain opacity-70"
          />
        )}
        <img
          src={restaurant.thumbnailUrl?.toString() || ""}
          alt={restaurant.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-2 px-4 py-3">
        <Link to={`/restaurant/${restaurant.id}`}>
          <h2 className="text-base font-semibold text-gray-800 hover:text-[#e4573d] hover:underline underline-offset-4 transition-colors duration-200">
            {restaurant.name}
          </h2>
        </Link>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <RatingStar rating={rating ?? 0} digit={1} />
          <span className="text-xs">
            ({typeof rating === "number" ? rating.toFixed(1) : "평점 없음"})
          </span>
        </div>

        <RestaurantCategoryBadge category={restaurant.category} />
      </div>
    </Card>
  );
}
