import { AuthForm } from "@/components/AuthForm";
import supabase from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import Fade from "@/components/ShiftPage";
import EmojiButton from "@/components/EmojiButton";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useAuth(); //  context에서 로그인 정보

  //로그인 입력 처리
  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
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

      setLoading(false);
      navigate("/");
    }
  };

  return (
    <Fade>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="mb-8 text-center space-y-2">
          <EmojiButton />

          <Link to="/main">
            <h1 className="text-3xl font-jua text-black hover:text-[#e4573d] transition-colors duration-300 ease-in-out font-['Gowun_Dodum']">
              요기얌
            </h1>
          </Link>

          <p className="text-xm text-muted-foreground pt-4 font-['Gowun_Dodum'] ">
            당신 주변의 숨은 맛집을 찾아보세요
          </p>
        </div>

        <AuthForm type="login" onSubmit={handleLogin} />

        <p className="mt-6 text-xm text-muted-foreground font-['Gowun_Dodum']">
          처음이신가요? ➡️{" "}
          <Link
            to="/signup"
            className="text-primary underline-offset-4 hover:underline hover:text-red-500  text-xm font-['Gowun_Dodum'] "
          >
            회원가입하러 가기
          </Link>
        </p>
      </div>
    </Fade>
  );
};

export default LoginPage;
