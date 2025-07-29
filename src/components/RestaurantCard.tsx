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
  likedCount,
  isLiked,
  onSearch,
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikedCount, setLocalLikedCount] = useState(likedCount);

  const isPopular = localLikedCount >= 3; // 이 숫자는 인기 맛집이 되기 위한 찜 갯수입니다.

  const likedButtonClick = async () => {
    const newLiked = !localLiked;
    setLocalLiked(newLiked);
    setLocalLikedCount((prev) => prev + (newLiked ? 1 : -1));

    if (newLiked) {
      await supabase.from("liked").insert({ restaurant_id: restaurant.id });
    } else {
      await supabase.from("liked").delete().eq("restaurant_id", restaurant.id);
    }

    onSearch();
  };

  return (
    <Card className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(50%-0.4rem)] relative flex flex-col rounded-xl overflow-hidden bg-[#fffaf6] transition-transform duration-100 hover:scale-[1.02] p-3 gap-3 ">
      {/* 인기 강조 배경 배지 */}
      {isPopular && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-extrabold rounded-md shadow-lg z-20 ">
          인기 맛집
        </div>
      )}

      {/* 좋아요 버튼 */}
      <div className="absolute top-1.5 right-1.5 z-10 flex flex-col items-center bg-white rounded-full shadow p-1">
        <Heart
          className="cursor-pointer"
          fill={localLiked ? "#ef4444" : "gray"}
          strokeWidth={0}
          size={20}
          onClick={likedButtonClick}
        />
        <span className="text-[10px] text-gray-500 mt-0.5">
          {localLikedCount}
        </span>
      </div>

      {/* 이미지 영역 */}
      <div className="relative w-full aspect-video bg-gray-100 mt-1">
        {!imageLoaded && (
          <img
            src="/loading.gif"
            alt="로딩 중"
            className="absolute inset-0 w-full object-contain opacity-70"
          />
        )}
        <img
          src={restaurant.thumbnailUrl?.toString() || ""}
          alt={restaurant.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`w-full h-40 object-cover transition-opacity duration-500 rounded-md ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-2">
        <RestaurantCategoryBadge category={restaurant.category} />
        <div className="flex flex-col">
          <Link to={`/restaurant/${restaurant.id}`}>
            <h2 className="text-lg font-semibold text-gray-800 hover:text-[#e4573d] hover:underline underline-offset-4 transition-colors duration-200">
              {restaurant.name}
            </h2>
          </Link>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <RatingStar rating={rating ?? 0} digit={1} size={14} />
          </div>
        </div>
      </div>
    </Card>
  );
}
