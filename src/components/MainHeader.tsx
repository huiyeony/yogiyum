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
import { useAuth } from "@/contexts/AuthContext";

export default function MainHeader() {
  return (
    <header
      className="flex justify-between items-center w-full px-6 py-3 
             sticky top-0 z-50 mb-2 bg-orange-200"
    >
      {/* 왼쪽 로고 */}
      <div className="flex items-center gap-2">
        <EmojiButton />

        <Link to="/Main">
          <h1
            className="text-2xl sm:text-5xl font-[Dongle] text-[#2c3e50] transition-all duration-300 ease-in-out 
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
  const { user, loading, setLoading, setUser, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (user) {
      console.log("현재 로그인한 사용자:", user.nickname);
    } else {
      console.log("로그인 안 됨");
    }
  }, [user, loading]);

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
              await logout();
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
