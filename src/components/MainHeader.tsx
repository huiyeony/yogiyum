import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EmojiButton from "./EmojiButton";
import { useAuth } from "@/contexts/AuthContext";

export default function MainHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLikeClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!user) {
      e.preventDefault(); // 링크 이동 막기
      navigate("/login");
    }
  };
  return (
    <header
      className="flex justify-between items-center w-full px-6 py-3
              sticky top-0 z-50 mb-2 bg-orange-200"
    >
      {/* 왼쪽 로고 */}
      <div className="flex items-center gap-2">
        <Link to="/Main">
          <h1
            className="text-3xl  font-['Gowun_Dodum'] text-[#2c3e50] transition-all duration-300 ease-in-out
                   hover:text-[#ff7043] hover:-translate-y-1 hover:scale-105 hover:tracking-wide"
          >
            요기얌
          </h1>
        </Link>
        <EmojiButton />
      </div>

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center gap-4 sm:gap-6 text-[#2c3e50]">
        <Link
          to="/LikedRestaurantsPage"
          className="hover:text-[#ff5630] hover:scale-120 transition-all duration-300 font-['Gowun_Dodum'] text-xm"
          onClick={handleLikeClick}
        >
          찜 리스트
        </Link>
        <span className="w-[2px] h-6 bg-red-500 opacity-50" />
        <UserButton />
      </div>
    </header>
  );
}

function UserButton() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="text-[#2c3e50] hover:scale-120 transition-all duration-300 font-medium px-2 py-1 rounded-md focus:outline-none font-['Gowun_Dodum']">
          {user.nickname}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border border-[#ffd9cc] shadow-md rounded-md">
          <DropdownMenuItem
            className="font-['Gowun_Dodum'] hover:bg-[#fff0eb] hover:pl-4 text-[#e4573d] transition-all duration-200"
            onClick={() => navigate("/myPage")}
          >
            마이페이지
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await logout();
              navigate("/Main");
            }}
            className="font-['Gowun_Dodum'] hover:bg-[#fff0eb] hover:pl-4 text-[#e4573d] transition-all duration-200"
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
      className="text-[#e4573d] hover:text-[#ff7043] hover:bg-[#ffe9e3] px-2 py-1 rounded-md font-['Gowun_Dodum'] transition-all duration-300"
    >
      로그인
    </Link>
  );
}
