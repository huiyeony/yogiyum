import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import type { Restaurant } from "@/entities/restaurant";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";

interface RestaurantWithStats extends Restaurant {
  averageRating: number;
  likedUserCount: number;
  thumbnailUrl: URL;
}

export default function LikedRestaurantsPage() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedRestaurants = async () => {
    if (!user) return;

    setLoading(true);

    const { data: likedList, error } = await supabase
      .from("liked")
      .select("restaurant_id")
      .eq("user_id", user.user_internal_id);

    if (error) {
      console.error("좋아요 목록 가져오기 실패", error.message);
      setLoading(false);
      return;
    }

    const likedIds = likedList?.map((like) => like.restaurant_id);

    if (!likedIds || likedIds.length === 0) {
      setRestaurants([]);
      setLoading(false);
      return;
    }

    const { data, error: restaurantError } = await supabase
      .from("restaurants_with_stats")
      .select("*")
      .in("id", likedIds);

    if (restaurantError) {
      console.error("레스토랑 정보 가져오기 실패", restaurantError.message);
      setLoading(false);
      return;
    }

    const fixedData: RestaurantWithStats[] = (data || []).map((item) => ({
      ...item,
      thumbnailUrl: item.thumbnail_url
        ? new URL(item.thumbnail_url)
        : new URL("https://picsum.photos/500"),
      averageRating: item.average_rating ?? 0,
      likedUserCount: item.liked_count ?? 0,
    }));

    setRestaurants(fixedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchLikedRestaurants();
  }, [user]);

  return (
    <main className="bg-[#fffaf6] min-h-screen py-6 px-4">
      <h1 className="text-3xl font-[jua] mb-6 text-orange-500">❤️ 찜 리스트</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <img
            src="/loading.gif"
            alt="로딩 중"
            className="w-32 h-32 object-contain mb-4"
          />
          <p className="text-lg text-[#e4573d] ">맛집을 불러오는 중이에요...</p>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-[#fffaf6] rounded-lg mt-10">
          <img
            src="/no_results.png"
            alt="좋아요 없음"
            className="w-48 h-48 object-contain mb-6 opacity-70"
          />
          <p className="text-2xl text-[#e4573d] font-[jua]">
            좋아요한 맛집이 없습니다 😢
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 justify-center">
          {restaurants.map((restaurant, idx) => (
            <RestaurantCard
              key={idx}
              restaurant={restaurant}
              rating={restaurant.averageRating}
              likedCount={restaurant.likedUserCount}
              isLiked={true}
              onSearch={fetchLikedRestaurants}
            />
          ))}
        </div>
      )}
    </main>
  );
}
