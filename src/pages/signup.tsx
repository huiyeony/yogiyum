import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmojiButton from "@/components/EmojiButton";

type Status = "idle" | "valid" | "invalid" | "checking";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// 🔧 4글자 '넘으면' → 길이 >= 6만 통과
const passwordOk = (pw: string) => pw.length >= 6;

export default function SignUpNoEmailVerification() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<Status>("invalid");

  const [password, setPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<Status>("invalid");

  const [nickname, setNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState<Status>("idle");

  const allValid =
    emailStatus === "valid" &&
    passwordStatus === "valid" &&
    nicknameStatus === "valid";

  //회원가입 버튼 활성화
  const enabled = allValid;

  // 이메일 형식 체크
  useEffect(() => {
    if (!email) return setEmailStatus("invalid");
    setEmailStatus(emailRegex.test(email) ? "valid" : "invalid");
  }, [email]);

  // 비밀번호 규칙 체크 (>=6자)
  useEffect(() => {
    if (!password) return setPasswordStatus("invalid");
    setPasswordStatus(passwordOk(password) ? "valid" : "invalid");
  }, [password]);

  // 닉네임 중복 검사 (최대 6자)
  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      const nick = nickname.trim();

      // 길이 조건 먼저 확인
      if (!nick || nick.length > 6) {
        if (alive) setNicknameStatus("invalid");
        return;
      }

      setNicknameStatus("checking");
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("nickname", nick)
        .maybeSingle();

      if (!alive) return;
      if (error) {
        console.error("닉네임 중복 검사 실패:", error.message);
        setNicknameStatus("invalid");
        return;
      }
      setNicknameStatus(data ? "invalid" : "valid");
    }, 300);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [nickname]);

  //회원가입 완료 버튼
  const handleSubmit = async () => {
    if (!allValid) return;

    try {
      // 1) 회원 생성
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("registered") || msg.includes("exists")) {
          setEmailStatus("invalid");
          alert("이미 등록된 이메일입니다.");
          return;
        }
        alert("회원가입 실패: " + error.message);
        return;
      }

      // 2) 세션 확보 (signUp이 세션을 안 주는 경우 대비)
      let session = data.session;
      let user = data.user;

      if (!session || !user) {
        // (1) onAuthStateChange를 기다리거나, (2) 바로 로그인으로 보장
        const { data: signInData, error: signInErr } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          alert("자동 로그인 실패: " + signInErr.message);
          return;
        }
        session = signInData.session;
        user = signInData.user;
      }

      if (!session || !user) {
        alert("세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      // 3) 프로필 upsert (RLS: auth.uid() = user_internal_id)
      const { error: upErr } = await supabase
        .from("users")
        .upsert(
          { user_internal_id: user.id, nickname: nickname.trim() },
          { onConflict: "user_internal_id" }
        );
      if (upErr) {
        if ((upErr as any).code === "23505") {
          setNicknameStatus("invalid");
          alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력하세요.");
          return;
        }
        alert("프로필 저장 실패: " + upErr.message);
        return;
      }

      // 4) 완료
      navigate("/intro", { replace: true });
    } catch (e: any) {
      alert("오류가 발생했습니다: " + (e?.message ?? "알 수 없는 오류"));
    }
  };

  const pill = (s: Status) => {
    if (s === "valid") return <span className="text-green-600">사용가능!</span>;
    if (s === "checking")
      return <span className="text-yellow-600">확인중…</span>;
    return <span className="text-red-600">사용불가</span>;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center space-y-2">
        <EmojiButton />
        <Link to="/main">
          <h1
            className="text-4xl  font-['Gowun_Dodum'] text-[#2c3e50] transition-all duration-300 ease-in-out
                   hover:text-[#ff7043] hover:-translate-y-1 hover:scale-105 hover:tracking-wide"
          >
            요기얌
          </h1>
        </Link>

        <p className="text-xm text-muted-foreground pt-4 font-[jua]">
          이메일 인증 없이 바로 가입해요
        </p>
      </div>

      <div className="w-full max-w-md space-y-5">
        {/* 이메일 */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-['Gowun_Dodum']"
            />
          </div>
          {pill(emailStatus)}
        </div>

        {/* 비밀번호 (>=6자) */}
        <div className="flex   items-center gap-3">
          <div className="flex-1">
            <Input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-['Gowun_Dodum']"
            />
          </div>
          {pill(passwordStatus)}
        </div>

        {/* 닉네임 (최대 6자) */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="닉네임 (최대 6글자)"
              value={nickname}
              maxLength={6} // 🔧 입력 자체 제한
              onChange={(e) => setNickname(e.target.value)}
              className="font-['Gowun_Dodum']"
            />
          </div>
          {pill(nicknameStatus)}
        </div>

        <Button
          type="button"
          disabled={!enabled}
          onClick={handleSubmit}
          className={[
            "w-[120px] mt-4 ml-60 font-['Gowun_Dodum'] transition-colors duration-200",
            enabled
              ? "bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white"
              : "bg-zinc-700 text-zinc-300 opacity-90 cursor-not-allowed hover:bg-zinc-700",
          ].join(" ")}
        >
          회원가입 완료
        </Button>
      </div>
    </div>
  );
}
