import MenuCard from "@/components/MenuCard";
import MenuCardSection from "@/components/MenuCardSection";
import RatingStar from "@/components/RatingStar";
import RestaurantCategoryBadge from "@/components/RestaurantCategoryBadge";
import ReviewCard from "@/components/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Menu } from "@/entities/menu";
import { RestaurantCategory, type Restaurant } from "@/entities/restaurant";
import type { Review } from "@/entities/review";
import staticMapUrl from "@/lib/static_map";
import supabase from "@/lib/supabase";
import { SendIcon, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface ReviewWithNickname extends Review {
  nickname: string;
}

interface RestaurantWithExtendInfo extends Restaurant {
  /// kakao map id
  kakaomapId: string;

  /// 평균 점수
  averageRating: number;
}

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<RestaurantWithExtendInfo>();
  const [reviews, setReviews] = useState<ReviewWithNickname[]>();
  const [menus, setMenus] = useState<Menu[]>();
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);

  supabase.auth.getSession().then(({ data }) => {
    setIsLogin(data.session !== null);
  });

  const handleReviewSubmit = async () => {
    if (reviewRating <= 0 || reviewRating > 5) {
      alert("점수가 잘못되었습니다. 다시 선택해주세요.");
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      rating: reviewRating,
      content: reviewContent,
      restaurant_id: restaurant?.id,
    });

    if (error) {
      console.error(error);
    } else {
      console.log("리뷰 게시 성공");
      setReviewContent("");
      setReviewRating(0);
      getReviews();
    }
  };

  const getRestaurantInfo = () => {
    supabase
      .from("restaurants_with_stats")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        console.log(data);
        setRestaurant({
          id: data.id,
          name: data.name,
          thumbnailUrl: new URL("https://picsum.photos/500"),

          latitude: data.latitude,
          longitude: data.longitude,

          address: data.address,
          telephone: data.phone,

          openingHour: "",
          category: data.category,

          kakaomapId: data.kakaomap_id,
          averageRating: data.average_rating,
        });
      });
  };

  const getMenus = () => {
    supabase
      .from("menus")
      .select("*")
      .eq("restaurant_id", id)
      .then(({ data }) => {
        if (!data) return;

        const newData = data.map((menu) => {
          return {
            id: menu.id,
            restaurantId: menu.restaurant_id,
            name: menu.menu,
            price: menu.menu_price,
            imageUrl: menu.menu_img ? new URL(menu.menu_img) : undefined,
            description: menu.menu_desc,
          };
        });

        setMenus(newData);
      });
  };

  const getReviews = () => {
    supabase
      .from("reviews")
      .select("*, users( nickname )")
      .eq("restaurant_id", id)
      .order("id", { ascending: false })
      .then(({ data }) => {
        const newData: ReviewWithNickname[] = data?.map((item) => {
          return {
            id: item.id,

            restaurantID: item.restaurant_id,
            userId: item.user_id,
            content: item.content,
            rating: item.rating,
            createdAt: item.created_at,

            nickname: item.users.nickname,
          };
        });

        setReviews(newData);
        console.log(newData);
      });
  };

  useEffect(() => {
    getRestaurantInfo();
    getMenus();
    getReviews();
  }, [id]);

  const StarSelector = ({ onSelect }: { onSelect: (n: number) => void }) => {
    const fill = "#facc15";
    const strokeWidth = 1.5;
    const borderColor = "#71717a";
    const size = 24;

    return (
      <div className="flex flex-row gap-2">
        {new Array(5).fill(0).map((_, idx) => (
          <Star
            key={idx}
            size={size}
            fill={reviewRating > idx ? fill : "white"}
            color={borderColor}
            strokeWidth={strokeWidth}
            onClick={() => onSelect(idx + 1)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        {/* 제목 영역 */}
        <div className="flex flex-row items-center gap-2 mt-4">
          <h1 className="text-3xl font-bold">{restaurant?.name}</h1>
          {restaurant?.category && (
            <RestaurantCategoryBadge category={restaurant?.category} />
          )}
        </div>

        <RatingStar
          rating={restaurant?.averageRating ?? 0}
          digit={2}
          size={28}
        />
      </header>
      <div className="flex flex-col gap-4">
        {/* 썸네일 영역 */}
        {restaurant && (
          <img
            className="w-full aspect-video rounded-md border"
            src={staticMapUrl(
              restaurant.latitude,
              restaurant.longitude,
            ).toString()}
          />
        )}
        {/* 상세 정보 영역 */}
        <div className="w-full flex flex-col gap-2">
          <dl className="flex flex-row gap-6 text-right">
            <dt className="w-15 flex items-center justify-start font-semibold">
              <Badge variant={"secondary"} className="text-sm font-semibold">
                주소
              </Badge>
            </dt>
            <dd>
              <Link
                className="underline"
                to={`https://place.map.kakao.com/${restaurant?.kakaomapId}`}
              >
                {restaurant?.address}
              </Link>
            </dd>
          </dl>

          <dl className="flex flex-row gap-6 text-right">
            <dt className="w-15 flex items-center justify-start font-semibold">
              <Badge variant={"secondary"} className="text-sm font-semibold">
                연락처
              </Badge>
            </dt>

            <dd>
              {restaurant?.telephone ?? (
                <small className="text-neutral-500">
                  연락처 정보가 없습니다.
                </small>
              )}
            </dd>
          </dl>
        </div>
      </div>

      {menus && menus.length > 0 && <MenuCardSection menus={menus} />}

      {/* 리뷰 부분 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">리뷰</h2>

        {/* 리뷰 작성 부분 */}
        <div className="flex flex-row gap-2 items-end">
          <div className="flex flex-col gap-4 flex-1">
            <StarSelector onSelect={setReviewRating} />

            <Textarea
              className="resize-none"
              placeholder={
                isLogin
                  ? "리뷰를 여기에 작성해주세요."
                  : "로그인 후 리뷰를 작성할 수 있습니다."
              }
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              disabled={!isLogin}
            />
          </div>

          <Button
            className="cursor-pointer"
            size="icon"
            onClick={handleReviewSubmit}
            disabled={!isLogin}
          >
            <SendIcon />
          </Button>
        </div>

        {/* 리뷰 목록 */}
        <div className="flex flex-col gap-2">
          {reviews?.map((review, idx) => (
            <ReviewCard
              key={idx}
              review={review}
              title={review.nickname}
              onUpdate={getReviews}
              onDelete={getReviews}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
