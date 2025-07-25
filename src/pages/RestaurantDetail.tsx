import RestaurantCategoryBadge from "@/components/RestaurantCategoryBadge";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RestaurantCategory, type Restaurant } from "@/entities/restaurant";
import type { Review } from "@/entities/review";
import supabase from "@/lib/supabase";
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function RestaurantDetail() {
  const id = "8";
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [reviews, setReviews] = useState<Review[]>();

  const getRestaurantInfo = () => {
    supabase
      .from("restaurants")
      .select("*")
      .eq("uid", id)
      .single()
      .then(({ data }) => {
        setRestaurant({
          id: data.uid,
          name: data.place_name,
          thumbnailUrl: new URL("https://picsum.photos/500"),

          latitude: data.x,
          longitude: data.y,

          address: data.road_address_name,
          telephone: data.phone,

          openingHour: "",
          category: RestaurantCategory.Korean,
        });
      });
  };

  const getReviews = () => {
    supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", id)
      .then(({ data }) => {
        const newData: Review[] = data?.map((item) => {
          return {
            restaurantID: item.restaurant_id,
            userId: item.user_id,
            comment: item.content,
            rating: item.rating,
            createdAt: item.created_at,
          };
        });

        setReviews(newData);
        console.log(newData);
      });
  };

  useEffect(() => {
    getRestaurantInfo();
    getReviews();
  }, [id]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <h1 className="text-3xl font-bold">{restaurant?.name}</h1>
        {restaurant?.category && (
          <RestaurantCategoryBadge category={restaurant?.category} />
        )}
      </div>

      <div className="w-full aspect-video p-2">
        <img className="w-full h-full rounded-md border" />
      </div>

      <div className="flex flex-col gap-2">
        <dl className="flex flex-row gap-2 text-right">
          <dt className="w-1/4 font-semibold">주소</dt>
          <dd>{restaurant?.address}</dd>
        </dl>

        <dl className="flex flex-row gap-2 text-right">
          <dt className="w-1/4 font-semibold">연락처</dt>
          <dd>
            {restaurant?.telephone ?? (
              <small className="text-neutral-500">
                연락처 정보가 없습니다.
              </small>
            )}
          </dd>
        </dl>

        <dl className="flex flex-row gap-2 text-right">
          <dt className="w-1/4 font-semibold">영업 시간</dt>
          <dd>
            {restaurant?.openingHour != "" ? (
              restaurant?.openingHour
            ) : (
              <small className="text-neutral-500">
                영업 시간 정보가 없습니다.
              </small>
            )}
          </dd>
        </dl>
      </div>

      {/* 리뷰 부분 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">리뷰</h2>

        {/* 리뷰 작성 부분 */}
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-2 flex-1">
            <Textarea placeholder="리뷰를 여기에 작성해주세요." />
          </div>

          <Button size="icon">
            <SendIcon />
          </Button>
        </div>

        {/* 리뷰 목록 */}
        <div className="flex flex-col gap-2">
          {reviews?.map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
