import { useMemo, useRef, useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import CategoryBadgeGroup from "@/components/CategoryBadgeGroup";
import type { CategoryLabel } from "@/constants/categoryMap";
import supabase from "@/lib/supabase";
import type { Restaurant } from "@/entities/restaurant";

/** 서버에서 내려오는 식당 + 통계 타입 */
export interface RestaurantWithStats extends Restaurant {
  averageRating?: number; // average_rating
  likedUserCount?: number; // liked_count
  reviewCount?: number; // review_count (있는 경우)
}

export type SortKey =
  | "liked_count"
  | "review_count"
  | "average_rating"
  | "name";

interface RestaurantBoardProps {
  /** 원본 데이터(부모/메인에서 받아온 데이터) */
  restaurants: RestaurantWithStats[];

  /** 정렬 키 */
  sortKey: SortKey;

  /** 로딩 상태(부모에서 내려줌) */
  isLoading?: boolean;

  /** 한글 라벨 -> EN 카테고리 매핑 (DB 값과 일치) */
  categoryKRtoENMap: Record<CategoryLabel, string>;

  /** 무한스크롤: 끝 도달 시 호출 (옵션) */
  onEndReached?: () => void;

  /** sentinel 활성화 (옵션) */
  enableEndReached?: boolean;

  /**
   * 선택이 0개일 때 정책
   * - true: 0개면 "카테고리 선택 안내" (0건)
   * - false: 0개여도 전체 노출
   */
  zeroSelectShowsEmpty?: boolean;

  /** (옵션) 선택 라벨이 바뀔 때 바깥에 알려주고 싶을 때 */
  onSelectedChange?: (labels: CategoryLabel[]) => void;
}

export default function RestaurantBoard({
  restaurants,
  sortKey,
  isLoading = false,
  categoryKRtoENMap,
  onEndReached,
  enableEndReached = false,
  zeroSelectShowsEmpty = true,
  onSelectedChange,
}: RestaurantBoardProps) {
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  /** 모든 라벨 목록 (초기 전체 선택) */
  const allLabels = useMemo(
    () => Object.keys(categoryKRtoENMap) as CategoryLabel[],
    [categoryKRtoENMap]
  );

  /** 선택 라벨: 처음엔 전부 선택 */
  const [selectedLabels, setSelectedLabels] =
    useState<CategoryLabel[]>(allLabels);

  /**  좋아요 목록(현재 로그인 유저의 찜) */
  const [likedList, setLikedList] = useState<{ restaurant_id: number }[]>([]);

  /**  좋아요 목록 조회 */
  const fetchLikedList = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) {
      setLikedList([]);
      return;
    }
    const { data, error } = await supabase
      .from("liked")
      .select("restaurant_id")
      .eq("user_id", userId);

    if (error) {
      console.error("[RestaurantBoard] fetchLikedList error:", error.message);
      setLikedList([]);
      return;
    }
    setLikedList(data ?? []);
  };

  /** 마운트 시 좋아요 목록 한 번 로드 */
  useEffect(() => {
    fetchLikedList();
  }, []);

  /** 배지 그룹에서 바뀐 선택을 반영 */
  const handleBadgeChange = (labels: CategoryLabel[]) => {
    setSelectedLabels(labels);
    onSelectedChange?.(labels);
  };

  /** 1) 필터링: 0개면 정책에 따라 0건 또는 전체 */
  const filtered = useMemo(() => {
    if (!selectedLabels || selectedLabels.length === 0) {
      return zeroSelectShowsEmpty ? [] : restaurants;
    }
    const selectedEN = new Set(
      selectedLabels.map((kr) => categoryKRtoENMap[kr])
    );
    return restaurants.filter((r) => selectedEN.has(r.category));
  }, [restaurants, selectedLabels, categoryKRtoENMap, zeroSelectShowsEmpty]);

  /** 2) 정렬 */
  const sorted = useMemo(() => {
    const base = [...filtered];
    switch (sortKey) {
      case "liked_count":
        return base.sort(
          (a, b) => (b.likedUserCount ?? 0) - (a.likedUserCount ?? 0)
        );
      case "review_count":
        return base.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      case "average_rating":
        return base.sort(
          (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)
        );
      case "name":
      default:
        return base.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filtered, sortKey]);

  /**  noResult 계산을 렌더 전으로 끌어올림 (아래 자동 다음페이지 요청에서 사용) */
  const showEmptyGuide = selectedLabels.length === 0 && zeroSelectShowsEmpty;
  const noResult = !showEmptyGuide && !isLoading && sorted.length === 0;

  /**  (추가) 결과가 비어있을 때, 자동으로 다음 페이지를 한 번 요청 */
  const autoRequestRef = useRef(false);
  useEffect(() => {
    // 무한스크롤이 켜져 있고 콜백이 있으며, 현재 결과가 0건인데
    // 이미 로드된 전체 배열은 존재한다면(=데이터는 있지만 필터 때문에 비어보임),
    // 상위에서 더 로드할 수 있도록 한번 요청해 준다.
    if (!enableEndReached || !onEndReached) return;

    if (!isLoading && noResult && restaurants.length > 0) {
      if (!autoRequestRef.current) {
        autoRequestRef.current = true;
        onEndReached(); // 상위에서 hasMore에 따라 다음 페이지 로드/무시
      }
    } else {
      // 결과가 생기거나 로딩 중이면 다시 요청 가능 상태로 리셋
      autoRequestRef.current = false;
    }
  }, [noResult, isLoading, enableEndReached, onEndReached, restaurants.length]);

  /** 3) 무한스크롤 sentinel 관찰 */
  useEffect(() => {
    if (!enableEndReached || !onEndReached) return;

    const el = lastItemRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onEndReached();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [enableEndReached, onEndReached, isLoading, sorted]);

  /** 4) UI 분기 */
  return (
    <section className="p-2">
      {/* 🔖 카테고리 뱃지 그룹 (게시판 내부 관리) */}
      <div className="mb-3">
        <CategoryBadgeGroup onChange={handleBadgeChange} />
      </div>

      {showEmptyGuide ? (
        <div className="font-['Gowun_Dodum'] flex flex-col items-center justify-center text-center py-20 bg-[rgba(255,242,237,0.6)] rounded-lg">
          <img
            src="/no_results.png"
            alt="선택된 카테고리가 없습니다"
            className="w-40 h-40 object-contain mb-4 opacity-70"
          />
          <p className="text-lg text-[#e4573d] font-['Gowun_Dodum']">
            카테고리를 선택해 주세요
          </p>
        </div>
      ) : !isLoading && sorted.length === 0 ? (
        // 결과 0건 (상위가 다음 페이지를 로드하면 곧 채워짐)
        <div className="flex flex-col items-center justify-center text-center py-20 bg-[rgba(255,242,237,0.6)] rounded-lg">
          <img
            src="/no_results.png"
            alt="검색 결과 없음"
            className="w-40 h-40 object-contain mb-4 opacity-70"
          />
          <p className="text-lg text-[#e4573d] font-['Gowun_Dodum']">
            조건에 맞는 식당이 없어요 😢
          </p>
        </div>
      ) : (
        // 리스트
        <div className="grid grid-cols-2 gap-3">
          {sorted.map((item, idx) => {
            const isLast = idx === sorted.length - 1;

            /**  현재 카드가 찜 상태인지(로그인 유저 기준) */
            const isLiked = likedList.some(
              (l) => l.restaurant_id === Number(item.id)
            );

            return (
              <div key={item.id}>
                <RestaurantCard
                  restaurant={item}
                  rating={item.averageRating ?? 0}
                  likedCount={item.likedUserCount ?? 0}
                  isLiked={isLiked}
                  onSearch={fetchLikedList}
                />
                {enableEndReached && isLast && <div ref={lastItemRef} />}
              </div>
            );
          })}
        </div>
      )}

      {/* 로딩 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <img
            src="/loading.gif"
            alt="로딩 중"
            className="w-24 h-24 object-contain mb-3"
          />
          <p className="text-sm text-[#e4573d]">맛집을 불러오는 중이에요...</p>
        </div>
      )}
    </section>
  );
}
