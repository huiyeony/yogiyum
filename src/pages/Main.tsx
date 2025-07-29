// ✅ 기본 import
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// ✅ 컴포넌트 import
import RestaurantCard from "@/components/RestaurantCard";
import SignupCouponBanner from "@/components/banner";
import CategoryModal from "@/components/ui/categorymodal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// ✅ 데이터 및 타입 import
import { RestaurantCategory, type Restaurant } from "@/entities/restaurant";
import supabase from "@/lib/supabase";

// ✅ 한글 카테고리 → 영문 카테고리 매핑
const categoryMap: Record<string, string> = {
  한식: "Korean",
  중식: "Chinese",
  일식: "Japanese",
  양식: "Western",
  카페: "Cafe",
};

// ✅ 레스토랑 통계 타입 정의
interface RestaurantWithStats extends Restaurant {
  averageRating: number;
  likedUserCount: number;
}

// ✅ 정렬 기준 타입
type SortType = "liked_count" | "review_count" | "average_rating";

const categoryStyleMap: Record<
  string,
  { emoji: string; label: string; color: string }
> = {
  전체: { emoji: "📋", label: "전체", color: "bg-gray-300" },
  한식: { emoji: "🍚", label: "한식", color: "bg-lime-400" },
  양식: { emoji: "🍝", label: "양식", color: "bg-orange-400" },
  일식: { emoji: "🍣", label: "일식", color: "bg-red-400" },
  중식: { emoji: "🍜", label: "중식", color: "bg-sky-400" },
  카페: { emoji: "☕", label: "카페", color: "bg-stone-400" },
  빵집: { emoji: "🥐", label: "빵집", color: "bg-gray-400" },
};

// ✅ 메인 페이지 컴포넌트
export default function MainPage() {
  // 🔧 상태 정의
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[] | null>(
    null
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [likedList, setLikedList] = useState<
    { restaurant_id: number; liked: boolean }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category")
      ? searchParams.get("category")!.split(",")
      : ["전체"]
  );
  const [sortType, setSortType] = useState<SortType>(
    (searchParams.get("sort") as SortType) ?? "liked_count"
  );

  // 🔍 식당 검색 함수
  const search = async () => {
    setIsLoading(true);

    let query = supabase
      .from("restaurants_with_stats")
      .select("*")
      .order(sortType, { ascending: false })
      .ilike("name", `%${searchValue}%`);

    // ✅ 전체가 아닐 경우 → 카테고리 필터링
    if (
      !(selectedCategories.length === 1 && selectedCategories[0] === "전체")
    ) {
      const mappedCategories = selectedCategories.map(
        (cat) => categoryMap[cat]
      );
      query = query.in("category", mappedCategories);
    }

    // 검색어 없으면 20개 제한
    if (searchValue === "") {
      query = query.limit(20);
    }

    const { data } = await query;

    if (!data) {
      setIsLoading(false);
      return;
    }

    // 데이터 가공
    const newData: RestaurantWithStats[] = data.map((item) => ({
      id: item.id,
      name: item.name,
      thumbnailUrl: new URL(item.thumbnail_url ?? "https://example.com/"),
      latitude: item.latitude,
      longitude: item.longitude,
      address: item.address,
      telephone: item.phone,
      openingHour: "",
      category: item.category,
      averageRating: item.average_rating,
      likedUserCount: item.liked_count,
    }));

    setRestaurants(newData);
    setIsLoading(false);
  };

  // ❤️ 좋아요 리스트 조회
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

  // 🌀 의존성 변화 시 검색 실행
  useEffect(() => {
    const params: any = {};

    if (searchValue) params.q = searchValue;
    if (
      !(selectedCategories.length === 1 && selectedCategories[0] === "전체")
    ) {
      params.category = selectedCategories.join(",");
    }
    if (sortType !== "liked_count") {
      params.sort = sortType;
    }

    setSearchParams(params);

    search();
    likedSearch();
  }, [searchValue, selectedCategories, sortType]);

  //비어있을 경우 카테고리 : 전체로 변환
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setSelectedCategories(["전체"]);
    }
  }, [selectedCategories]);

  // ✅ 실제 화면 렌더
  return (
    <>
      <SignupCouponBanner />

      <main className="bg-[#fffaf6] min-h-screen py-6 px-4">
        {/* 🔍 검색창 */}
        <div className="flex flex-row gap-4 items-center mb-6">
          <Input
            className="h-12 w-full rounded-full px-6 bg-neutral-100 border-neutral-200 placeholder:text-black-400 placeholder:text-base focus:outline-none focus:ring-2 focus:ring-primary"
            type="text"
            placeholder="🔍  뭐 먹지? 지금 검색해보세요!"
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {/* 🔽 정렬 + 카테고리 버튼 */}
          <div className="flex gap-4 items-center mb-1">
            <SortSelector onChange={setSortType} value={sortType} />

            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="h-9 px-3 py-2 text-sm rounded-md border border-input bg-transparent text-foreground outline-none flex items-center justify-between"
            >
              카테고리
            </button>
          </div>

          {/* 카테고리 뱃지  */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map((category, index) => {
              const { emoji, label, color } = categoryStyleMap[category] || {
                emoji: "❓",
                label: category,
                color: "bg-gray-300",
              };

              const isDisabled =
                selectedCategories.length === 1 && category === "전체";

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedCategories((prev) =>
                        prev.filter((cat) => cat !== category)
                      );
                    }
                  }}
                  className={`
    flex flex-col items-center justify-center w-16 h-20 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
    ${color} ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-md"
                  }
  `}
                >
                  {/* 이모지 (흰색 원 배경 안에 표시) */}
                  <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow">
                    <span className="text-xl">{emoji}</span>
                  </div>

                  {/* 라벨 (아래 글씨) */}
                  <div className="mt-1 text-black text-[11px] font-[jua]">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📦 카테고리 모달 */}
        {isCategoryModalOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-[1000] flex justify-center items-end"
            onClick={() => setIsCategoryModalOpen(false)}
          >
            <CategoryModal
              selected={selectedCategories}
              onChange={setSelectedCategories}
              onClose={() => setIsCategoryModalOpen(false)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* 📋 검색 결과 섹션 */}
        <div className="p-2">
          {isLoading ? (
            // 🔄 로딩 중 화면
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src="/loading.gif"
                alt="로딩 중"
                className="w-32 h-32 object-contain mb-4"
              />
              <p className="text-lg text-[#e4573d]">
                맛집을 불러오는 중이에요...
              </p>
            </div>
          ) : restaurants && restaurants.length > 0 ? (

            // ✅ 결과 리스트
            <div className="flex flex-wrap gap-3">

              {restaurants.map((item, idx) => (
                <RestaurantCard
                  key={idx}
                  restaurant={item}
                  rating={item.averageRating}
                  likedCount={item.likedUserCount}
                  isLiked={likedList.some(
                    (liked) => liked.restaurant_id === item.id
                  )}
                  onSearch={likedSearch}
                />
              ))}
            </div>
          ) : (
            // ❌ 검색 결과 없음
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

// ✅ 정렬 셀렉트 컴포넌트
function SortSelector({
  onChange,
  value,
}: {
  onChange: (value: SortType) => void;
  value: SortType;
}) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 방식" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="liked_count">찜하기 많은 순</SelectItem>
        <SelectItem value="review_count">리뷰 많은 순</SelectItem>
        <SelectItem value="average_rating">별점 높은 순</SelectItem>
      </SelectContent>
    </Select>
  );
}
