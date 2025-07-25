import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import { RestaurantCategory, type Restaurant } from "@/entities/restaurant";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface RestaurantWithStats extends Restaurant {
  /// 별점 평균
  averageRating: number;

  /// 좋아요한 유저 수
  likedUserCount: number;
}

export default function MainPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[] | null>(
    null
  );
  const [likedList, setLikedList] = useState<
    {
      restaurant_id: number;
      liked: boolean;
    }[]
  >([]);

  const search = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("*, reviews (rating), liked (*)")
      .ilike("place_name", `%${searchValue}%`)
      .limit(searchValue === "" ? 20 : Infinity);

    if (!data) {
      return;
    }

    console.log(data);

    const newData: RestaurantWithStats[] = data.map((item) => {
      const averageRating = item.reviews.length
        ? item.reviews.reduce((acc, cur) => acc + cur.rating, 0)
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
      <div className="flex flex-row gap-4 items-center">
        <Input
          className="h-12"
          type="text"
          placeholder="검색어를 여기에 입력하세요"
          onChange={(e) => {
            setSearchValue(e.target.value);
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

      <div className="flex flex-col gap-4 p-4">
        {restaurants?.map((item, idx) => {
          return (
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
          );
        })}
      </div>
    </>
  );
}
