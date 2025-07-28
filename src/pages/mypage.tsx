import { useEffect, useState } from "react";
import { User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";
import ReviewCard from "@/components/ReviewCard";
import type { Review } from "@/entities/review";

interface ReviewWithRestaurant extends Review {
  restaurants: {
    place_name: string;
  };
}

function MyPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [comments, setComments] = useState<ReviewWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchUserAndComments = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("세션 없음");
        setLoading(false);
        return;
      }

      const uid = session.user.id;

      const { data: user, error: userErr } = await supabase
        .from("users")
        .select("*")
        .eq("user_internal_id", uid)
        .single();

      if (userErr || !user) return;

      setUserId(user.id);
      setNickname(user.nickname);
      setCreatedAt(user.created_at);

      const { data: reviews, error: reviewErr } = await supabase
        .from("reviews")
        .select("*, restaurants(place_name)")
        .eq("user_id", user.user_internal_id);

      if (reviewErr) {
        console.error("리뷰 에러:", reviewErr);
      } else {
        const newData: ReviewWithRestaurant[] =
          reviews?.map((item) => ({
            id: item.id,
            restaurant_id: item.restaurant_id,
            user_id: item.user_id,
            content: item.content,
            rating: item.rating,
            created_at: item.created_at,
            restaurants: {
              place_name: item.restaurants?.place_name || "알 수 없음",
            },
          })) || [];

        setComments(newData);
      }

      setLoading(false);
    };

    fetchUserAndComments();
  }, []);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;

  if (!userId) {
    return (
      <div className="w-[60vw] mx-auto mt-10 text-center space-y-4">
        <p className="text-neutral-500">로그인 후 이용해주세요.</p>
        <button
          className="mt-4 px-4 py-2 bg-black text-white rounded-md"
          onClick={() => navigate("/")}
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  const displayedComments = showAll ? comments : comments.slice(0, 5);
  const hasMore = comments.length > 5;
  const toggleLabel = showAll ? "접기" : "더보기";

  return (
    <div className="w-full max-w-3xl mx-auto min-h-screen mt-10 space-y-6 px-6">
      {/* 유저 정보 */}
      <div className="w-full flex justify-between items-start bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4">
          <User
            size={72}
            className="border rounded-full p-2 text-gray-600 bg-gray-100"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-[jua] bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                닉네임
              </span>
              <span className="text-sm">{nickname}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-[jua] bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                가입일
              </span>
              <span className="text-sm">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <button
          className="text-gray-500 hover:text-black transition"
          onClick={() =>
            navigate("/edit-profile", { state: { nickname, id: userId } })
          }
        >
          <Settings />
        </button>
      </div>

      {/* 리뷰 섹션 */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl font-[jua]">나의 리뷰</p>
        {hasMore && (
          <button
            className="text-sm text-neutral-500 hover:underline"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {toggleLabel}
          </button>
        )}
      </div>

      <div className="min-h-[760px] space-y-4">
        {displayedComments.length > 0 ? (
          displayedComments.map((review, idx) => (
            <ReviewCard
              key={review.id}
              review={review}
              title={review.restaurants?.place_name || "알 수 없음"}
              onUpdate={(newContent) => {
                const updated = [...comments];
                updated[idx] = { ...updated[idx], content: newContent };
                setComments(updated);
              }}
              onDelete={() => {
                const updated = [...comments];
                updated.splice(idx, 1);
                setComments(updated);
              }}
            />
          ))
        ) : (
          <p className="text-neutral-400">작성한 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MyPage;
