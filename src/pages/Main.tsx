import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import { RestaurantCategory } from "@/entities/restaurant";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

export default function MainPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [restaurants, setRestaurants] = useState();

  const search = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .ilike("place_name", `%${searchValue}%`)
      .limit(searchValue === "" ? 20 : Infinity);
    console.log(data);
    setRestaurants(data);
  };

  useEffect(() => {
    search();
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
          className="h-12 aspect-square"
          onClick={() => {
            search();
          }}
        >
          <SearchIcon />
        </Button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {restaurants?.map((item) => {
          return (
            <RestaurantCard
              restaurant={{
                name: item.place_name,
                category: RestaurantCategory.Japanese,
                thumbnailUrl: new URL("https://picsum.photos/500"),
              }}
            />
          );
        })}
      </div>
    </>
  );
}
