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
        <div className="w-full max-w-sm mx-auto p-6 bg-red-100 shadow rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center font-gowun">{type === "login" ? "로그인" : "회원가입"}</h2>
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
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-2 border-gray-300 rounded-xl px-4 py-2 shadow-sm transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />

                <Input
                    placeholder="비밀번호"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-2 border-gray-300 rounded-xl px-4 py-2 shadow-sm transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />

                <Button type="submit" className="w-full font-gowun bg-red-400 hover:bg-red-600 transition-colors duration-200">
                    {type === "login" ? "로그인" : "회원가입"}
                </Button>
            </form>
        </div>
    );
};
