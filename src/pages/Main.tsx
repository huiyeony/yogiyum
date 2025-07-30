// ✅ 기본 import
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// ✅ 컴포넌트 import
import SignupCouponBanner from "@/components/banner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import RestaurantBoard, {
  type RestaurantWithStats,
  type SortKey,
} from "@/components/RestaurantBoard";

// ✅ Supabase
import supabase from "@/lib/supabase";

// ✅ 정렬 기준
type SortType = "liked_count" | "review_count" | "average_rating" | "name";
const DEFAULT_PAGE_SIZE = 20;

export default function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔧 상태 정의
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 초기 true 권장
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("q") ?? ""
  );
  const [sortType, setSortType] = useState<SortType>(
    ((searchParams.get("sort") as SortType) ?? "liked_count") as SortType
  );

  // 페이지네이션
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  // ❤️ 좋아요 리스트 (옵션)
  const [setLikedList] = useState<{ restaurant_id: number; liked: boolean }[]>(
    []
  );

  // 🔎 파라미터 동기화 (선택)
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchValue) params.q = searchValue;
    if (sortType && sortType !== "liked_count") params.sort = sortType;
    setSearchParams(params);
  }, [searchValue, sortType]);

  //
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

  // 📊 전체 개수 → maxPage 갱신
  useEffect(() => {
    const fetchCount = async () => {
      let countQuery = supabase
        .from("restaurants_with_stats")
        .select("id", { count: "exact", head: true });

      if (searchValue.trim()) {
        countQuery = countQuery.ilike("name", `%${searchValue}%`);
      }

      const { count } = await countQuery;
      const total = count ?? 0;
      setMaxPage(Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE)));
    };

    fetchCount();
  }, [searchValue]);

  // 🔍 데이터 조회 (페이지·정렬·검색 반영 / 카테고리 필터 제거됨)
  const fetchRestaurants = async ({
    nextPage = 1,
    append = false,
    nextSort = sortType,
    nextQ = searchValue,
  }: {
    nextPage?: number;
    append?: boolean;
    nextSort?: SortType;
    nextQ?: string;
  }) => {
    setIsLoading(true);

    let query = supabase
      .from("restaurants_with_stats")
      .select("*")
      .order(nextSort === "name" ? "name" : nextSort, {
        ascending: nextSort === "name", // 이름만 오름차순, 나머지는 desc
      })
      .order("id") // tie-break
      .range(
        (nextPage - 1) * DEFAULT_PAGE_SIZE,
        nextPage * DEFAULT_PAGE_SIZE - 1
      );

    if (nextQ.trim()) {
      query = query.ilike("name", `%${nextQ}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[fetchRestaurants] error:", error.message);
      setRestaurants([]);
      setIsLoading(false);
      return;
    }

    const mappedData: RestaurantWithStats[] =
      data?.map((item: any) => ({
        id: item.id,
        name: item.name,
        thumbnailUrl: item.thumbnail_url
          ? new URL(item.thumbnail_url)
          : undefined,
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
        telephone: item.phone,
        openingHour: "",
        category: item.category, // EN
        averageRating: item.average_rating,
        likedUserCount: item.liked_count,
        reviewCount: item.review_count ?? 0,
      })) ?? [];

    setRestaurants((prev) =>
      append ? [...(prev ?? []), ...mappedData] : mappedData
    );
    setIsLoading(false);
  };

  // 초기 & 의존성 변화 시: 1페이지로 재조회
  useEffect(() => {
    setPage(1);
    fetchRestaurants({ nextPage: 1, append: false });
    likedSearch(); // (옵션)
  }, [sortType, searchValue]);

  // 무한 스크롤: 게시판 sentinel 콜백
  const handleEndReached = () => {
    if (isLoading) return;
    if (page >= maxPage) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchRestaurants({ nextPage, append: true });
  };

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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                fetchRestaurants({ nextPage: 1, append: false });
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {/* 🔽 정렬 */}
          <div className="flex gap-4 items-center mb-1">
            <SortSelector
              onChange={(val) => {
                setSortType(val);
                setPage(1);
                fetchRestaurants({ nextPage: 1, append: false, nextSort: val });
              }}
              value={sortType}
            />
          </div>
        </div>

        {/* 📋 게시판 (카테고리 뱃지 그룹은 RestaurantBoard 내부에서 관리) */}
        <RestaurantBoard
          restaurants={restaurants}
          sortKey={toSortKey(sortType)}
          isLoading={isLoading}
          // RestaurantBoard 내부 필터용: 한→영 매핑 전달
          categoryKRtoENMap={{
            한식: "Korean",
            중식: "Chinese",
            일식: "Japanese",
            양식: "Western",
            카페: "Cafe",
            빵집: "Bakery",
          }}
          onEndReached={handleEndReached}
          enableEndReached={true}
        />
      </main>
    </>
  );
}

// ✅ 정렬 셀렉트
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
        <SelectItem value="name">이름순(가나다/ABC)</SelectItem>
      </SelectContent>
    </Select>
  );
}

// ✅ MainPage의 SortType → RestaurantBoard의 SortKey로 캐스팅(동일 타입이면 생략 가능)
function toSortKey(s: SortType): SortKey {
  return s as SortKey;
}
