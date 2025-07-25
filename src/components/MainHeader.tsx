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

export default function MainHeader() {
  return (
    <header className="flex flex-row w-full justify-between items-center py-4">
      {/* 헤더 왼쪽 */}
      <Link to="/">
        <h1 className="text-xl font-bold">요기얌</h1>
      </Link>

      <div className="flex flex-row gap-6">
        {/* 찜하기 버튼 */}
        <Link to="">
          <ShoppingBagIcon />
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
        if (!res.data.session) {
          return;
        }

        const uid = res.data.session.user.id;

        return supabase
          .from("users")
          .select()
          .eq("user_internal_id", uid)
          .single();
      })
      .then(({ data }) => {
        if (!data) {
          return;
        }

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
        <DropdownMenuTrigger>{user.nickname}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>마이페이지</DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
              navigate("/");
            }}
          >
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return <Link to="/login">로그인</Link>;
  }
}
