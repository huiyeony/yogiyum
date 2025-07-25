import { useState } from "react";
import { Heart } from "lucide-react";
import { Card } from "./ui/card";
import type { Restaurant } from "@/entities/restaurant";
import RestaurantCategoryBadge from "./RestaurantCategoryBadge";
import RatingStar from "./RatingStar";
import supabase from "@/lib/supabase";
import { Link } from "react-router-dom";

interface Props {
  readonly restaurant: Restaurant;
  readonly rating: number;
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
    <Card className="flex flex-row justify-between p-4 transition-opacity duration-500">
      {/* 이미지 부분 */}
      <div className="h-30 aspect-square relative rounded-sm overflow-hidden bg-gray-100">
        {/* 로딩 중인 gif */}
        {!imageLoaded && (
          <img
            src="/loading.gif"
            alt="로딩 중"
            className="absolute inset-0 w-full h-full object-contain opacity-70"
          />
        )}

        {/* 실제 썸네일 이미지 */}
        <img
          src={restaurant.thumbnailUrl.toString()}
          alt={restaurant.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex-1 flex flex-col gap-4 px-4">
        <Link to={`/restaurant/${restaurant.id}`}>
          <h2 className="text-xl font-semibold hover:text-[#e4573d] hover:underline underline-offset-4 transition-colors duration-200">
            {restaurant.name}
          </h2>
        </Link>
        <RatingStar rating={rating} digit={1} />
        <RestaurantCategoryBadge category={restaurant.category} />
      </div>

      {/* 찜 버튼 */}
      <div className="flex flex-col items-center justify-start">
        <Heart
          className="cursor-pointer"
          fill={isLiked ? "#ef4444" : "gray"}
          strokeWidth={0}
          size={40}
          onClick={likedButtonClick}
        />
        <span className="text-sm text-neutral-500">{likedCount}</span>
      </div>
    </Card>
  );
}
