import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { emojiList } from "@/constants/emojiList";
import { useState } from "react";
import supabase from "@/lib/supabase";

const TempPage = () => {
  const location = useLocation();
  const { from, userEmail } = location.state || {};

  // 메일 재전송 함수
  const resendVerificationEmail = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
      options: {
        emailRedirectTo: "http://localhost:5173/temp",
      },
    });

    if (error) {
      alert("재전송 실패: " + error.message);
    } else {
      alert("인증 메일이 다시 전송되었습니다.");
    }
  };

  //이모지 눌렸을때
  const [emojiIndex, setEmojiIndex] = useState<number>(0);
  const handleClickEmoji = () => {
    if (emojiIndex + 1 === emojiList.length) {
      setEmojiIndex(0);
    } else {
      setEmojiIndex(emojiIndex + 1);
    }
  };

  //표시할 메세지
  const message =
    from === "login" ? (
      <div className="mt-5 font-jua">
        로그인 완료 ✅
        <br /> <p className="text-red-600">{userEmail}</p>로 로그인 되었습니다!
      </div>
    ) : from === "signup" ? (
      <div className="mt-5 font-jua">
        <p className="text-red-600">{userEmail}</p>로 인증 메일이
        발송되었습니다. <br />
        <br />
        <button
          className=" hover:underline  hover:text-red-500 font-jua"
          onClick={resendVerificationEmail}
        >
          이메일이 오지 않았나요?
        </button>
      </div>
    ) : (
      // 아무 상태 없이 왔을 경우  -> 이메일 인증 후
      <div>
        <div className="mt-5 text-xl font-jua">회원 가입 완료✅</div>
        ➡️
        <Link
          to="/login"
          className="text-base underline-offset-4 hover:underline  hover:text-red-500 font-jua "
        >
          로그인 하기
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center space-y-2">
        <button
          className="inline-block animate-bounce text-4xl "
          onClick={handleClickEmoji}
        >
          {emojiList[emojiIndex]}
        </button>
        <h1 className="text-4xl font-gowun font-bold text-foreground">
          요기얌
        </h1>

        <div>{message}</div>
      </div>
    </div>
  );
};
export default TempPage;
