// src/components/NavBar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Home,
} from "lucide-react";

const NavBar = () => {
  const { token, clearToken } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    clearToken();
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen px-4 py-6 flex flex-col justify-between">
      <div className="space-y-6">
        <NavLink
          to="/"
          className="text-2xl font-bold text-blue-600 block text-center"
          aria-label="Go to homepage"
        >
          Lovable
        </NavLink>

        <nav className="space-y-2 mt-6" aria-label="Primary Navigation">
          <SidebarLink to="/" icon={<Home size={18} />} label="Home" />
          {token && (
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
            />
          )}
        </nav>
      </div>

      <div className="space-y-2">
        {token ? (
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start gap-2"
            aria-label="Logout"
          >
            <LogOut size={18} />
            Logout
          </Button>
        ) : (
          <>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-2"
              aria-label="Login"
            >
              <NavLink to="/login">
                <LogIn size={18} /> Login
              </NavLink>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="w-full justify-start gap-2"
              aria-label="Signup"
            >
              <NavLink to="/signup">
                <UserPlus size={18} /> Signup
              </NavLink>
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
      }`
    }
    aria-current={({ isActive }) => (isActive ? "page" : undefined)}
  >
    {icon}
    {label}
  </NavLink>
);

export default NavBar;
