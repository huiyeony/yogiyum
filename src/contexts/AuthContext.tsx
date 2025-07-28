import { createContext, useContext, useEffect, useState } from "react";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

//   DB에 저장된 유저 정보 타입
export interface AppUser {
  id: number;
  nickname: string;
  email: string;
  registerDate: string;
}

// Context에서 제공할 타입
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => Promise<void>;
}

// Context 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  setLoading: () => {},
  logout: async () => {},
});

// Context Provider 컴포넌트
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 유저 정보 불러오기 (auth + DB)
  const fetchUser = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setUser(null);
      setLoading(false);
      return;
    }

    const uid = session.user.id;
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("user_internal_id", uid)
      .single();

    if (error) {
      console.error("🔴 유저 정보 가져오기 실패:", error.message);
      setUser(null);
    } else if (data) {
      setUser({
        id: data.id,
        nickname: data.nickname,
        email: data.email,
        registerDate: data.created_at,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setUser(null);
        } else {
          fetchUser(); // 세션 있으면 다시 유저 정보 가져오기
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 함수
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, setLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//  context 사용하는 훅
export const useAuth = () => useContext(AuthContext);
