import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LayoutDashboard, Tag, CalendarDays, Users, FileText, LogOut } from "lucide-react";

export default function DashboardLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Kategori Event", path: "/dashboard/kategori", icon: Tag },
    { name: "Event", path: "/dashboard/event", icon: CalendarDays },
    { name: "Pembicara", path: "/dashboard/pembicara", icon: Users },
    { name: "Biodata", path: "/dashboard/biodata", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tighter text-white">Invo<span className="text-red-500">Fest</span></h1>
        </div>

        <nav className="flex flex-col px-4 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-red-600 text-white shadow-md" 
                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}