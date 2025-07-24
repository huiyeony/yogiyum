// src/components/Layout.tsx
import TestHeader from "@/components/TestHeader";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TestHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
