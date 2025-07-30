import { useLocation, Link, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import EmojiButton from "@/components/EmojiButton";
import supabase from "@/lib/supabase";

const TempPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, userEmail } = location.state || {};

  // 메일 재전송 함수
  const resendVerificationEmail = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/temp`,
      },
    });

    if (error) {
      alert("재전송 실패: " + error.message);
    } else {
      alert("인증 메일이 다시 전송되었습니다.");
    }
  };

  // login일 경우 자동 이동
  useEffect(() => {
    if (from === "login") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500); // 1.5초 후 이동
      return () => clearTimeout(timer);
    }
  }, [from, navigate]);

  //표시할 메세지
  const message =
    from === "login" ? (
      <div className="text-xl mt-5 font-['Gowun_Dodum']">
        로그인 완료 ✅
        <br />{" "}
        <p className="text-xl text-red-600 font-['Gowun_Dodum']">{userEmail}</p>
        로 로그인 되었습니다!
      </div>
    ) : from === "signup" ? (
      <div className="mt-5 font-[jua]">
        <p className="text-xl text-red-600 font-['Gowun_Dodum']">{userEmail}</p>
        로 인증 메일이 발송되었습니다. <br />
        <br />
        <button
          className=" text-xm hover:underline hover:text-red-500 font-['Gowun_Dodum']"
          onClick={resendVerificationEmail}
        >
          이메일이 오지 않았나요?
        </button>
      </div>
    ) : (
      <div>
        <div className="mt-5 text-xl font-jua">회원 가입 완료✅</div>
        ➡️
        <Link
          to="/login"
          className="text-base underline-offset-4 hover:underline hover:text-red-500 font-jua"
        >
          로그인 하기
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center space-y-2">
        <EmojiButton />
        <Link to="/">
          <h1 className="text-4xl font-['Gowun_Dodum'] text-black hover:text-[#e4573d] transition-colors duration-300 ease-in-out">
            요기얌
          </h1>
        </Link>

        <div>{message}</div>
      </div>
    </div>
  );
};

export default TempPage;
