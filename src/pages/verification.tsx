import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmojiButton from "@/components/EmojiButton";

const VerificationPage = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  // 인증 후 새 창에서 들어왔을 경우, 유저 정보를 다시 context에 채움
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        //setUser(data.user);
      } else {
        alert("이메일 인증 후 다시 로그인해주세요.");
      }
    };

    checkUser();
  }, []);

  const handleSubmit = async () => {
    const name = nickname.trim();
    if (!name) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      // ✅ 현재 탭의 세션에서 uid 가져오기 (컨텍스트 사용 X)
      const {
        data: { session },
        error: sessErr,
      } = await supabase.auth.getSession();
      if (sessErr) throw sessErr;
      if (!session?.user) {
        alert(
          "로그인 정보를 확인할 수 없습니다. 이메일 인증 후 다시 시도해주세요."
        );
        return;
      }

      const uid = session.user.id;

      // ✅ 이미 행이 있으면 업데이트, 없으면 생성 (중복/재방문 안전)
      const { error: upErr } = await supabase.from("users").upsert(
        {
          user_internal_id: uid,
          nickname: name,
        },
        { onConflict: "user_internal_id" } // user_internal_id에 UNIQUE 인덱스가 있어야 안전
      );

      if (upErr) throw upErr;

      // 완료 후 다음 페이지로
      navigate("/temp", { replace: true });
    } catch (e: any) {
      console.error("닉네임 저장 실패:", e?.message ?? e);
      alert("회원 정보 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center space-y-2">
        <EmojiButton />
        <h1 className="text-3xl font-['Gowun_Dodum'] font-bold text-foreground">
          요기얌
        </h1>
        <div className="mt-5 text-xl font-['Gowun_Dodum']">
          회원 가입 완료✅
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-center font-['Gowun_Dodum'] pb-8">
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
            className="font-['Gowun_Dodum'] w-1/4 bg-red-400 hover:bg-red-600 transition-colors duration-200"
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
