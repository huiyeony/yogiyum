import { AuthForm } from "@/components/AuthForm";
import supabase from "@/lib/supabase";
import { Link } from "react-router-dom";
import Fade from "@/components/ShiftPage";
import { emojiList } from "@/constants/emojiList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  //이모지 눌렸을 때
  const [emojiIndex, setEmojiIndex] = useState<number>(0);
  const handleClickEmoji = () => {
    if (emojiIndex + 1 === emojiList.length) {
      setEmojiIndex(0);
    } else {
      setEmojiIndex(emojiIndex + 1);
    }
  };

  //회원가입 눌렀을 때
  const handleSignup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/verification", // 원하는 리디렉션 URL
      },
    });

    if (error) {
      alert("회원가입 실패: " + error.message);
    } else if (data.user?.identities?.length === 0) {
      // 이미 가입된 이메일
      alert("이미 가입된 이메일입니다.");
    } else {
      navigate("/temp", { state: { from: "signup", userEmail: email } });
    }
  };

  return (
    <Fade>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="mb-8 text-center space-y-2">
          <button
            className="inline-block animate-bounce text-4xl "
            onClick={handleClickEmoji}
          >
            {emojiList[emojiIndex]}
          </button>
          <h1 className="text-3xl font-jua text-foreground">요기얌</h1>
          <p className="text-sm text-muted-foreground font-jua">
            맛집 리뷰를 남기고 공유해보세요
          </p>
        </div>

        <AuthForm type="signup" onSubmit={handleSignup} />

        <p className="mt-6 text-sm text-muted-foreground font-jua">
          이미 계정이 있으신가요? ➡️
          <Link
            to="/login"
            className="text-primary underline-offset-4 hover:underline  hover:text-red-500 font-medium font-jua"
          >
            로그인 하기
          </Link>
        </p>
      </div>
    </Fade>
  );
};

export default SignUpPage;
