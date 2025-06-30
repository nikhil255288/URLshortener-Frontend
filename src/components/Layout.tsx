// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import NavBar from "@/components/NavBar";

const Layout = () => (
  <div className="flex min-h-screen overflow-hidden">
    <NavBar /> {/* Sidebar (conditionally renders based on token) */}
    <main className="flex-1 p-4 bg-slate-50 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default Layout;
