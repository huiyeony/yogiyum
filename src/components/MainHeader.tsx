import type { User } from "@/entities/user";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import supabase from "@/lib/supabase";
import { ShoppingBagIcon } from "lucide-react";
import { emojiList } from "@/constants/emojiList";

export default function MainHeader() {
  const [emojiIndex, setEmojiIndex] = useState<number>(0);

  const handleClickEmoji = () => {
    setEmojiIndex((prev) => (prev + 1) % emojiList.length);
  };

  return (
    <header className="flex justify-between items-center w-full px-6 py-2 bg-[#fff2ed]  border-b border-[#ffd9cc] sticky top-0 z-50 mb-2">
      {/* 왼쪽 로고 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleClickEmoji}
          className="text-3xl text-[#e4573d] animate-bounce hover:scale-125 hover:text-[#ff5630] hover:drop-shadow transition-all duration-300 focus:outline-none"
        >
          {emojiList[emojiIndex]}
        </button>
        <Link to="/">
          <h1 className="text-2xl font-bold text-[#e4573d] hover:text-[#ff7043] hover:-translate-y-0.5 transition-all duration-300">
            요기얌
          </h1>
        </Link>
      </div>

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center space-x-5">
        <Link
          to=""
          className="text-[#e4573d] hover:text-[#ff5630] hover:scale-110 transition-all duration-300"
        >
          <ShoppingBagIcon size={22} />
        </Link>
        <UserButton />
      </div>
    </header>
  );
}

function UserButton() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then((res) => {
        if (!res.data.session) return;
        const uid = res.data.session.user.id;
        return supabase
          .from("users")
          .select()
          .eq("user_internal_id", uid)
          .single();
      })
      .then(({ data }) => {
        if (!data) return;
        setUser({
          id: data.id,
          nickname: data.nickname,
          email: "asdf",
          registerDate: data.created_at,
        });
      });
  }, []);

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="text-[#e4573d] hover:text-[#ff7043] font-medium px-2 py-1 rounded-md hover:bg-[#ffe9e3] hover:shadow-sm transition-all duration-300 focus:outline-none">
          {user.nickname}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border border-[#ffd9cc] shadow-md rounded-md">
          <DropdownMenuItem
            className="hover:bg-[#fff0eb] hover:pl-4 text-[#e4573d] transition-all duration-200"
            onClick={() => navigate("/myPage")}
          >
            마이페이지
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
              navigate("/");
            }}
            className="hover:bg-[#fff0eb] hover:pl-4 text-[#e4573d] transition-all duration-200"
          >
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      to="/login"
      className="text-[#e4573d] hover:text-[#ff7043] hover:bg-[#ffe9e3] px-2 py-1 rounded-md font-medium transition-all duration-300"
    >
      로그인
    </Link>
  );
}
