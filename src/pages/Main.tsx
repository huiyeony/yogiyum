import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import { RestaurantCategory, type Restaurant } from "@/entities/restaurant";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import SignupCouponBanner from "@/components/banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RestaurantWithStats extends Restaurant {
  averageRating: number;
  likedUserCount: number;
}

type SortType = "liked_count" | "review_count" | "average_rating";

export default function MainPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[] | null>(
    null,
  );
  const [likedList, setLikedList] = useState<
    { restaurant_id: number; liked: boolean }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortType, setSortType] = useState<SortType>("liked_count");

  const search = async () => {
    setIsLoading(true);

    const { data } = await supabase
      .from("restaurants_with_stats")
      .select("*")
      .order(sortType, { ascending: false })
      .ilike("name", `%${searchValue}%`)
      .limit(searchValue === "" ? 20 : Infinity);

    if (!data) {
      setIsLoading(false);
      return;
    }

    const newData: RestaurantWithStats[] = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        thumbnailUrl: new URL("https://picsum.photos/500"),
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
        telephone: item.phone,
        openingHour: "",
        category: item.category,
        averageRating: item.average_rating,
        likedUserCount: item.liked_count,
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
  }, [sortType]);

  return (
    <>
      <SignupCouponBanner />
      <main className="bg-[#fffaf6] min-h-screen py-6 px-4">
        {/* 검색창 */}
        <div className="flex flex-row gap-4 items-center mb-6">
          <Input
            className="h-12 w-full rounded-full px-6 bg-[#f0f0f0] border-gray-300 placeholder:text-black-400 focus:outline-none focus:ring-2 focus:ring-primary"
            type="text"
            placeholder="🔍 뭐 먹지? 지금 검색해보세요!"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
          />
        </div>

        <SortSelector onChange={setSortType} />

        {/* 결과 섹션 */}
        <div className="p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src="/loading.gif"
                alt="로딩 중"
                className="w-32 h-32 object-contain mb-4"
              />
              <p className="text-lg text-[#e4573d] ">
                맛집을 불러오는 중이에요...
              </p>
            </div>
          ) : restaurants && restaurants.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {restaurants.map((item, idx) => (
                <RestaurantCard
                  key={idx}
                  restaurant={item}
                  rating={item.averageRating}
                  likedCount={item.likedUserCount}
                  isLiked={
                    likedList.filter((liked) => liked.restaurant_id === item.id)
                      .length > 0
                  }
                  onSearch={likedSearch}
                />
              ))}
            </div>
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
      </main>
    </>
  );
}

function SortSelector({ onChange }: { onChange: (value: SortType) => void }) {
  return (
    <Select onValueChange={onChange} defaultValue="liked_count">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 방식" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="liked_count">찜하기 많은 순</SelectItem>
        <SelectItem value="review_count">리뷰 많은 순</SelectItem>
        <SelectItem value="average_rating">리뷰 평균 점수 높은 순</SelectItem>
      </SelectContent>
    </Select>
  );
}
