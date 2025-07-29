import { Outlet } from "react-router-dom";
import MainHeader from "@/components/MainHeader";

export default function Layout() {
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-135">
                <MainHeader />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
