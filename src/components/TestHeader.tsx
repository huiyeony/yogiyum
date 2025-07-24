// src/components/Header.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

const TestHeader = () => {
  const { user, loading } = useAuth();
  const [nickname, setNickname] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState(false);

  useEffect(() => {
    const fetchNickname = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("nickname")
        .eq("user_internal_id", user.id)
        .single();

      if (error || !data?.nickname) {
        setNicknameError(true);
        setNickname(null);
      } else {
        setNickname(data.nickname);
        setNicknameError(false);
      }
    };

    fetchNickname();
  }, [user]);

  return (
    <header className="w-full bg-gray-100 px-4 py-2 shadow-md flex justify-between items-center">
      <h1 className="font-bold text-lg">🍜 요기얌</h1>
      <div className="text-sm text-gray-600 flex items-center gap-2">
        {loading ? (
          "로딩 중..."
        ) : user ? (
          <>
            ✅ 로그인됨
            <span>
              | 닉네임:{" "}
              {nicknameError ? (
                <span className="text-red-500 font-semibold">닉네임 없음</span>
              ) : (
                <span className="font-semibold">{nickname}</span>
              )}
            </span>
          </>
        ) : (
          "❌ 로그인되지 않음"
        )}
      </div>
    </header>
  );
};

export default TestHeader;
