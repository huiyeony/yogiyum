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
import EmojiButton from "./EmojiButton";

export default function MainHeader() {
  return (
    <header
      className="flex justify-between items-center w-full px-6 py-3 bg-[#fffaf6]]
             sticky top-0 z-50 mb-2"
    >
      {/* 왼쪽 로고 */}
      <div className="flex items-center gap-2">
        <EmojiButton />

        <Link to="/">
          <h1
            className="text-2xl sm:text-3xl font-Jua text-[#2c3e50] transition-all duration-300 ease-in-out 
                   hover:text-[#ff7043] hover:-translate-y-1 hover:scale-105 hover:tracking-wide"
          >
            요기얌
          </h1>
        </Link>
      </div>

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center gap-4 sm:gap-6 text-[#e4573d]">
        <Link
          to=""
          className="hover:text-[#ff5630] hover:scale-110 transition-all duration-300"
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
        <DropdownMenuTrigger className="text-[#2c3e50] hover:text-[#ff7043] font-medium px-2 py-1 rounded-md hover:bg-[#ffe9e3] hover:shadow-sm transition-all duration-300 focus:outline-none">
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
