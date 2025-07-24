import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface Props {
  type: "login" | "signup";
  onSubmit: (email: string, password: string) => void;
}

export const AuthForm = ({ type, onSubmit }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-neutral-100 shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center font-gowun">
        {type === "login" ? "로그인" : "회원가입"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(email, password);
        }}
        className="space-y-4"
      >
        <Input
          placeholder="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full font-gowun">
          {type === "login" ? "로그인" : "회원가입"}
        </Button>
      </form>
    </div>
  );
};
