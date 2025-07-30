import { AuthForm } from "@/components/AuthForm";
import supabase from "@/lib/supabase";
import { Link } from "react-router-dom";
import Fade from "@/components/ShiftPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmojiButton from "@/components/EmojiButton";

const SignUpPage = () => {
  const navigate = useNavigate();

  // 회원가입 눌렀을 때
  const handleSignup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verification`, // 인증 후 이동
      },
    });

    if (error) {
      alert("회원가입 실패: " + error.message);
    } else if (data.user?.identities?.length === 0) {
      alert("이미 가입된 이메일입니다.");
      navigate("/login");
    } else {
      navigate("/temp", { state: { from: "signup", userEmail: email } });
    }
  };

  // ✅ 이메일 인증 완료 시 자동 이동
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          console.log("✅ 이메일 인증 감지됨 → /verification 이동");
          navigate("/verification");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Fade>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="mb-8 text-center space-y-2">
          <EmojiButton />
          <Link to="/main">
            <h1 className="text-3xl font-['Gowun_Dodum'] text-black hover:text-[#e4573d] transition-colors duration-300 ease-in-out">
              요기얌
            </h1>
          </Link>
          <p className="text-xm text-muted-foreground pt-4 font-[jua]">
            맛집 리뷰를 남기고 공유해보세요
          </p>
        </div>

        <AuthForm type="signup" onSubmit={handleSignup} />

        <p className="mt-6 text-xm text-muted-foreground font-['Gowun_Dodum']">
          이미 계정이 있으신가요? ➡️{" "}
          <Link
            to="/login"
            className="text-primary underline-offset-4 hover:underline  hover:text-red-500 text-xm font-['Gowun_Dodum']"
          >
            로그인 하기
          </Link>
        </p>
      </div>
    </Fade>
  );
};

export default SignUpPage;
