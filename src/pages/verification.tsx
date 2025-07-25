import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { emojiList } from "@/constants/emojiList";

const VerificationPage = () => {
  const [nickname, setNickname] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    // 1. 로그인된 유저 정보 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      alert("로그인 정보가 없습니다.");

      return;
    }
    let error = null;

    const res = await supabase
      .from("profiles")
      .insert({ id: user.id, nickname });

    error = res.error;

    if (error) {
      console.error("DB 삽입 실패:", error.message);
      alert("회원 정보 저장에 실패했습니다.");
      return;
    }

    navigate("/temp");
  };

  //이모지 바꾸기
  const [emojiIndex, setEmojiIndex] = useState<number>(0);
  const handleClickEmoji = () => {
    if (emojiIndex + 1 === emojiList.length) {
      setEmojiIndex(0);
    } else {
      setEmojiIndex(emojiIndex + 1);
    }
  };

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
            className=" font-gowun w-1/4"
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
