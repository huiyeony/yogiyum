import { useState, useMemo, useEffect } from "react";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Restaurant } from "@/entities/restaurant";
import RestaurantCategoryBadge from "@/components/RestaurantCategoryBadge";
import RatingStar from "@/components/RatingStar";
import supabase from "@/lib/supabase";
import { Link } from "react-router-dom";

interface Props {
  restaurant: Restaurant;
  rating?: number;
  likedCount: number;
  isLiked: boolean;
  onSearch: () => void; // 부모에서 리스트/좋아요 다시 불러오는 함수
}

export default function RestaurantCard({
  restaurant,
  rating = 0,
  likedCount,
  isLiked,
  onSearch,
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikedCount, setLocalLikedCount] = useState(likedCount);
  const [clicking, setClicking] = useState(false); // 중복 클릭 방지

  useEffect(() => setLocalLiked(isLiked), [isLiked]);
  useEffect(() => setLocalLikedCount(likedCount), [likedCount]);

  const thumbnailSrc = useMemo(() => {
    const t = (restaurant as any).thumbnailUrl as string | URL | undefined;
    if (!t) return "";
    return typeof t === "string" ? t : t.toString();
  }, [restaurant]);

  const restaurantIdNum = useMemo(() => {
    const raw = (restaurant as any).id;
    const n = typeof raw === "number" ? raw : Number(raw);
    return Number.isNaN(n) ? undefined : n;
  }, [restaurant]);

  const isPopular = localLikedCount >= 3;

  const toggleLike = async () => {
    if (clicking) return;
    if (restaurantIdNum === undefined) return;

    setClicking(true);

    const next = !localLiked;
    setLocalLiked(next);
    setLocalLikedCount((prev) => prev + (next ? 1 : -1));

    try {
      const { data: sessionData, error: sessErr } =
        await supabase.auth.getSession();
      if (sessErr) throw sessErr;
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("로그인이 필요합니다.");

      if (next) {
        const { error } = await supabase
          .from("liked")
          .insert({ user_id: userId, restaurant_id: restaurantIdNum });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("liked")
          .delete()
          .eq("user_id", userId)
          .eq("restaurant_id", restaurantIdNum);
        if (error) throw error;
      }

      onSearch();
    } catch (e) {
      console.error(e);
      setLocalLiked((prev) => !prev);
      setLocalLikedCount((prev) => prev - (next ? 1 : -1));
    } finally {
      setClicking(false);
    }
  };

  return (
    <Card className="w-full relative flex flex-col rounded-xl overflow-hidden bg-[#fffaf6] transition-transform duration-100 hover:scale-[1.02] p-3 gap-3">
      {/* 인기 배지 */}
      {isPopular && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-extrabold rounded-md shadow-lg z-20">
          인기 맛집
        </div>
      )}

      {/* 좋아요 버튼 */}
      <div className="absolute top-1.5 right-1.5 z-10 flex flex-col items-center bg-white rounded-full shadow p-1">
        <button
          type="button"
          onClick={toggleLike}
          disabled={clicking}
          className="cursor-pointer disabled:opacity-50"
          aria-pressed={localLiked}
          aria-label={localLiked ? "찜 해제" : "찜하기"}
        >
          <Heart
            fill={localLiked ? "#ef4444" : "gray"}
            strokeWidth={0}
            size={20}
          />
        </button>
        <span className="text-[10px] text-gray-500 mt-0.5">
          {localLikedCount}
        </span>
      </div>

      {/* 이미지: 로딩/썸네일 동일 사이즈 */}
      <div className="relative w-full aspect-video mt-1 bg-gray-100 rounded-md overflow-hidden">
        {!imageLoaded && (
          <img
            src="/loading.gif"
            alt="로딩 중"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        )}
        <img
          src={thumbnailSrc}
          alt={restaurant.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}

          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${

            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* 텍스트 */}
      <div className="flex flex-col gap-2">
        <RestaurantCategoryBadge category={restaurant.category} />
        <div className="flex flex-col">
          <Link to={`/restaurant/${String(restaurant.id)}`}>
            <h2 className="text-lg font-semibold text-gray-800 hover:text-[#e4573d] hover:underline underline-offset-4 transition-colors duration-200">
              {restaurant.name}
            </h2>
          </Link>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <RatingStar rating={rating} digit={1} size={14} />
          </div>
        </div>
      </div>
    </Card>
  );
}
