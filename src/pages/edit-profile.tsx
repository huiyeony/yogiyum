import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../lib/supabase";

export default function EditProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const oldNickname = location.state?.nickname || "";
  const [nickname, setNickname] = useState(oldNickname);
  const userId = location.state?.id;

  const handleSubmit = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ nickname })
      .eq("id", userId);

    if (error) {
      alert("수정 실패: " + error.message);
      return;
    }

    localStorage.setItem("nickname", nickname);
    alert("수정 완료!");
    window.location.href = "/mypage";
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 탈퇴하시겠습니까?");
    if (!confirmDelete || !userId) return;

    const { error } = await supabase.from("users").delete().eq("id", userId); // ← userId는 현재 로그인된 유저 ID여야 함

    if (error) {
      alert("탈퇴 실패: " + error.message);
      return;
    }

    // 로컬 정보 제거 & 홈 이동
    localStorage.removeItem("nickname");
    localStorage.removeItem("user_id");
    alert("회원탈퇴 완료!");
    navigate("/");
  };
  return (
    <div className="w-100% mx-auto mt-10 space-y-6 px-6">
      <h1 className="text-2xl font-['Gowun_Dodum'] text-center">
        개인정보 수정
      </h1>

      <div className="flex flex-col gap-2">
        <label className="font-['Gowun_Dodum']">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-black text-white py-2 rounded-md font-['Gowun_Dodum']"
      >
        수정하기
      </button>
      <div className="flex flex-col justify-end items-center">
        <button
          onClick={handleDelete}
          className="underline text-neutral-400 absolute bottom-4 font-['Gowun_Dodum']"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
