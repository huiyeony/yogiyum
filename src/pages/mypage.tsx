import { useEffect, useState } from 'react';
import { User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import ReviewCard from '@/components/ReviewCard';
import type { Review } from '@/entities/review';
interface ReviewWithRestaurant extends Review {
  restaurants: {
    place_name: string;
  };
}

function MyPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [comments, setComments] = useState<ReviewWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchUserAndComments = async () => {
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', 21)
        .single();

      if (userErr || !user) {
        console.error('유저를 찾지 못했습니다.', userErr);
        setLoading(false);
        return;
      }

      setNickname(user.nickname);
      setCreatedAt(user.created_at);
      setUserId(user.id);

      const { data: reviews, error: reviewErr } = await supabase
        .from('reviews')
        .select('*, restaurants(place_name)')
        .eq('user_id', 21); //

      if (reviewErr) {
        console.error('리뷰 에러:', reviewErr);
      } else {
        setComments(reviews);
      }

      setLoading(false);
    };

    fetchUserAndComments();
  }, []);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  const displayedComments = showAll ? comments : comments.slice(0, 5);
  const hasMore = comments.length > 5;
  const toggleLabel = showAll ? '접기' : '더보기';

  if (!userId) {
    return (
      <div className="w-[60vw] mx-auto mt-10 text-center space-y-4">
        <p className="text-neutral-500">로그인 후 이용해주세요.</p>
        <button
          className="mt-4 px-4 py-2 bg-black text-white rounded-md"
          onClick={() => navigate('/')}>
          홈으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="w-[60vw] mx-auto min-h-screen mt-10 space-y-6">
      {/* 유저 정보 */}
      <div className="w-full flex justify-between">
        <div className="flex justify-start gap-4">
          <User size={64} className="border rounded-full" />
          <div>
            <p>닉네임: {nickname}</p>
            <p>가입 날짜: {new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <button
          onClick={() =>
            navigate('/edit-profile', { state: { nickname, id: userId } })
          }>
          <Settings />
        </button>
      </div>

      {/* 리뷰 섹션 */}
      <div className="mt-4 flex justify-between ">
        <p className="text-xl font-bold">나의 리뷰</p>

        {hasMore && (
          <button
            className="text-sm text-neutral-500"
            onClick={() => setShowAll((prev) => !prev)}>
            {toggleLabel}
          </button>
        )}
      </div>
      <div className="min-h-[760px] space-y-4">
        {displayedComments.length > 0 ? (
          displayedComments.map((comment, idx) => (
            <ReviewCard
              key={idx}
              review={comment}
              title={comment.restaurants.place_name}
              onUpdate={(newComment) => {
                const updated = [...comments];
                updated[idx] = { ...updated[idx], content: newComment };
                setComments(updated);
              }}
              onDelete={() => {
                const updated = [...comments];
                updated.splice(idx, 1); // 배열에서 삭제
                setComments(updated);
              }}
            />
          ))
        ) : (
          <p className="text-neutral-400">작성한 리뷰가 없습니다.</p>
        )}
      </div>
      {/* 로그아웃 */}
      <div className="flex flex-col justify-end items-center">
        <button
          onClick={() => {
            localStorage.removeItem('nickname');
            localStorage.removeItem('user_id');
            navigate('/');
          }}
          className="border py-3 px-12 rounded-2xl bg-neutral-200 bottom-4">
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default MyPage;
