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
  // const [liked, setLiked] = useState<boolean>(isLiked);

  const likedButtonClick = () => {
    if (isLiked) {
      // 찜하기 취소
      supabase
        .from("liked")
        .delete()
        .eq("restaurant_id", restaurant.id)
        .then((res) => {
          if (res.status <= 200 || res.status > 300) return;
          onSearch();
          // setLiked(!liked);
        });
    } else {
      // 찜하기
      supabase
        .from("liked")
        .insert({ restaurant_id: restaurant.id })
        .then((res) => {
          if (res.status <= 200 || res.status > 300) return;
          onSearch();
          // setLiked(!liked);
        });
    }
  };

  return (
    <Card className="flex flex-row justify-between p-4">
      {/* 이미지 부분 */}
      <div className="h-40 aspect-square">
        <img src={restaurant.thumbnailUrl.toString()} className="rounded-sm" />
      </div>

      {/* 카드 메인 부분 */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center gap-2">
          {/* <Link to={`/restaurant/${restaurant.id}`}>
            <h2 className="flex-1 text-2xl font-bold">{restaurant.name}</h2>
          </Link> */}
          <Link to={`/restaurant/${restaurant.id}`}>
            <h2 className="flex-1 text-2xl font-bold hover:text-[#e4573d] hover:underline underline-offset-4 transition-colors duration-200">
              {restaurant.name}
            </h2>
          </Link>
        </div>

        {/* 별점 부분 */}
        <RatingStar rating={rating} digit={1} />

        {/* 카테고리 배지 부분 */}
        <RestaurantCategoryBadge category={restaurant.category} />
      </div>

      {/* 찜하기 버튼 부분 */}
      <div className="flex flex-col items-center">
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
