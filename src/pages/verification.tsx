import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmojiButton from "@/components/EmojiButton";
import { useAuth } from "@/contexts/AuthContext";

const VerificationPage = () => {
  const [nickname, setNickname] = useState("");
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // 인증 후 새 창에서 들어왔을 경우, 유저 정보를 다시 context에 채움
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        alert("이메일 인증 후 다시 로그인해주세요.");
      }
    };

    checkUser();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const { error } = await supabase.from("users").insert({
      user_internal_id: user.id,
      nickname,
    });

    if (error) {
      console.error("DB 삽입 실패:", error.message);
      alert("회원 정보 저장에 실패했습니다.");
      return;
    }

    navigate("/temp");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center space-y-2">
        <EmojiButton />
        <h1 className="text-4xl font-gowun font-bold text-foreground">
          요기얌
        </h1>
        <div className="mt-5 text-xl font-jua">회원 가입 완료✅</div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-center font-gowun pb-8">
          닉네임을 입력해주세요
        </h1>
        <div className="flex flex-row gap-3">
          <Input
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button
            type="submit"
            className="font-gowun w-1/4 bg-red-400 hover:bg-red-600 transition-colors duration-200"
            onClick={handleSubmit}
          >
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
