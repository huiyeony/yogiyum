import { useState, useMemo, useEffect, useRef } from "react";
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
  onSearch: () => void;
}

export default function RestaurantCard({
  restaurant,
  rating = 0,
  likedCount,
  isLiked,
  onSearch,
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikedCount, setLocalLikedCount] = useState(likedCount);
  const [clicking, setClicking] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => setLocalLiked(isLiked), [isLiked]);
  useEffect(() => setLocalLikedCount(likedCount), [likedCount]);

  // 썸네일 src 안전 변환 (빈 문자열 금지)
  const thumbnailSrc = useMemo(() => {
    const t = restaurant.thumbnailUrl as string | URL | undefined | null;
    if (!t) return undefined;
    return typeof t === "string" ? t : t.toString();
  }, [restaurant]);

  // 썸네일 변경 시 초기화 + 캐시 완료 대응
  useEffect(() => {
    setShowFallback(false);
    if (!thumbnailSrc) {
      setImageLoaded(true); // 이미지 없으면 스피너 즉시 종료
      return;
    }
    setImageLoaded(false);
    requestAnimationFrame(() => {
      if (imgRef.current?.complete) setImageLoaded(true);
    });
  }, [thumbnailSrc]);

  const restaurantIdNum = useMemo(() => {
    const raw = restaurant.id;
    const n = typeof raw === "number" ? raw : Number(raw);
    return Number.isNaN(n) ? undefined : n;
  }, [restaurant]);

  const isPopular = localLikedCount >= 3;

  const toggleLike = async () => {
    if (clicking || restaurantIdNum === undefined) return;
    setClicking(true);

    const next = !localLiked;
    setLocalLiked(next);
    setLocalLikedCount((p) => p + (next ? 1 : -1));

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
      setLocalLiked((p) => !p);
      setLocalLikedCount((p) => p - (next ? 1 : -1));
    } finally {
      setClicking(false);
    }
  };

  return (
    <Card className="w-full relative flex flex-col rounded-xl overflow-hidden bg-[#fffaf6] transition-transform duration-100 hover:scale-[1.02] p-3 gap-3">
      {isPopular && (
        <div
          className="font-['Gowun_Dodum'] absolute top-2 left-2 px-2 py-1
  bg-white text-orange-600 text-xs font-extrabold
  rounded-md border border-orange-500/80 shadow-sm z-20"
        >
          인기 맛집🔥
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

      {/* 이미지: 실패 시 대체 이미지 */}
      <div className="relative w-full aspect-video mt-1 bg-gray-100 rounded-md overflow-hidden">
        {!imageLoaded && (
          <img
            src="/loading.gif"
            alt="로딩 중"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        )}

        {/* 1) 정상 썸네일 */}
        {thumbnailSrc && !showFallback && (
          <img
            key={thumbnailSrc}
            ref={imgRef}
            src={thumbnailSrc}
            alt={restaurant.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setShowFallback(true);
              setImageLoaded(false);
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* 2) 대체 이미지 */}
        {(!thumbnailSrc || showFallback) && (
          <img
            src="/no-image.png" // 원하는 대체 이미지
            alt="이미지 없음"
            onLoad={() => setImageLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex flex-col gap-2">
        <RestaurantCategoryBadge category={restaurant.category} />
        <div className="flex flex-col">
          <Link to={`/restaurant/${String(restaurant.id)}`}>
            <h2 className="text-lg font-['Gowun_Dodum'] text-gray-800 hover:text-[#e4573d] hover:underline underline-offset-4 transition-colors duration-200">
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
