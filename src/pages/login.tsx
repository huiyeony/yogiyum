import { AuthForm } from "@/components/AuthForm";
import supabase from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import Fade from "@/components/ShiftPage";
import { emojiList } from "@/constants/emojiList";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, setLoading } = useAuth(); // ✅ context에서 로그인 정보

  const [emojiIndex, setEmojiIndex] = useState<number>(0);
  const handleClickEmoji = () => {
    setEmojiIndex((prev) => (prev + 1) % emojiList.length);
  };

  //이 페이지 킬때 강제 로그아웃
  useEffect(() => {
    const forceLogout = async () => {
      await supabase.auth.signOut(); // 세션 초기화
      setUser(null); // context에서도 초기화
      setLoading(false);
    };
    forceLogout();
  }, [setLoading, setUser]);

  //로그인 입력 처리
  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let message = "로그인에 실패했습니다.";
      if (error.message.includes("Invalid login credentials")) {
        message = "이메일 또는 비밀번호가 잘못되었습니다.";
      } else if (error.message.includes("Email not confirmed")) {
        message = "이메일 인증이 완료되지 않았습니다.";
      } else if (error.message.includes("User already registered")) {
        message = "이미 등록된 계정입니다.";
      }
      alert(message);
    } else {
      //로그인 상태 변경
      setUser(data.user);
      setLoading(false);
      navigate("/temp", { state: { from: "login", userEmail: email } });
    }
  };

  // // ✅ 로딩 중일 땐 아무것도 렌더링하지 않음
  // if (loading) return null;

  return (
    <Fade>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="mb-8 text-center space-y-2">
          <button
            className="inline-block animate-bounce text-4xl"
            onClick={handleClickEmoji}
          >
            {emojiList[emojiIndex]}
          </button>
          <h1 className="text-3xl font-jua text-foreground">요기얌</h1>
          <p className="text-sm text-muted-foreground font-jua">
            당신 주변의 숨은 맛집을 찾아보세요
          </p>
        </div>

        <AuthForm type="login" onSubmit={handleLogin} />

        <p className="mt-6 text-sm text-muted-foreground font-jua">
          처음이신가요? ➡️{" "}
          <Link
            to="/signup"
            className="text-primary underline-offset-4 hover:underline hover:text-red-500 font-medium font-jua"
          >
            회원가입하러 가기
          </Link>
        </p>

        <Link
          to="/verification"
          className="text-primary underline-offset-4 hover:underline hover:text-red-500 font-medium font-jua"
        >
          임시페이지 이동 (확인용)
        </Link>
      </div>
    </Fade>
  );
};

export default LoginPage;
