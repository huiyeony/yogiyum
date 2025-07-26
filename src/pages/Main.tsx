
import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import { RestaurantCategory, type Restaurant } from "@/entities/restaurant";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

import SignupCouponBanner from "@/components/banner";

interface RestaurantWithStats extends Restaurant {
  averageRating: number;
  likedUserCount: number;
}

export default function MainPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[] | null>(
    null
  );
  const [likedList, setLikedList] = useState<
    { restaurant_id: number; liked: boolean }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const search = async () => {
    setIsLoading(true);

    const { data } = await supabase
      .from("restaurants")
      .select("*, reviews (rating), liked (*)")
      .ilike("place_name", `%${searchValue}%`)
      .limit(searchValue === "" ? 20 : Infinity);

    if (!data) {
      setIsLoading(false);
      return;
    }

    const newData: RestaurantWithStats[] = data.map((item) => {
      const averageRating = item.reviews.length
        ? item.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
          item.reviews.length
        : 0;

      const likedUserCount = item.liked.length;

      return {
        id: item.uid,
        name: item.place_name,
        thumbnailUrl: new URL("https://picsum.photos/500"),
        latitude: item.y,
        longitude: item.x,
        address: item.road_address_name,
        telephone: item.phone,
        openingHour: "",
        category: item.category,
        averageRating,
        likedUserCount,
      };
    });

    setRestaurants(newData);
    setIsLoading(false);
  };

  const likedSearch = async () => {
    const session = await supabase.auth.getSession();
    await supabase
      .from("liked")
      .select("*")
      .eq("user_id", session.data.session?.user.id)
      .then((res) => {
        setLikedList(res.data || []);
      });
  };

  useEffect(() => {
    search();
    likedSearch();
  }, []);

  return (
    <>
      <SignupCouponBanner />

      <div className="flex flex-row gap-4 items-center">
        <Input
          className="h-12"
          type="text"
          placeholder="뭐 먹지?"
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
        />

        <Button
          type="submit"
          className="h-12 aspect-square"
          onClick={() => {
            search();
          }}
        >
          <SearchIcon />
        </Button>
      </div>

      {/* 결과 섹션 */}
      <div className="flex flex-col gap-4 p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <img
              src="/loading.gif"
              alt="로딩 중"
              className="w-32 h-32 object-contain mb-4"
            />
            <p className="text-lg text-[#e4573d] font-jua">
              맛집을 불러오는 중이에요...
            </p>
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          restaurants.map((item, idx) => (
            <RestaurantCard
              key={idx}
              restaurant={{ ...item }}
              rating={item.averageRating}
              likedCount={item.likedUserCount}
              isLiked={
                likedList.filter((liked) => liked.restaurant_id === item.id)
                  .length > 0
              }
              onSearch={likedSearch}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-[#fff2ed] rounded-lg mt-10">
            <img
              src="/no_results.png"
              alt="검색 결과 없음"
              className="w-48 h-48 object-contain mb-6 opacity-70"
            />
            <p className="text-2xl text-[#e4573d] font-jua">
              검색 결과가 없습니다 😢
            </p>
          </div>
        )}
      </div>
    </>
  );
}
