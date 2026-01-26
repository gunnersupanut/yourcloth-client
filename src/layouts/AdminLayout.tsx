import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // รายการเมนูตาม Wireframe เป๊ะๆ
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Catalog", path: "/admin/catalog", icon: <Package size={20} /> },
    { name: "Order", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "User", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Report", path: "/admin/reports", icon: <BarChart3 size={20} /> },
    { name: "Support", path: "/admin/support", icon: <LifeBuoy size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-admin-bg font-kanit text-text_inverse">
      {/* Sidebar (ยุบ-ขยายได้) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-admin-card border-r border-gray-700 transition-all duration-300 shadow-admin
        ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Header: Logo & Toggle */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-700/50">
          {/* โชว์ Logo เฉพาะตอนขยาย */}
          {isSidebarOpen ? (
            <span className="font-logo text-3xl text-admin-secondary font-black tracking-tighter truncate">
              YOURCLOTH
            </span>
          ) : (
            <span className="font-logo text-xl text-admin-secondary font-black mx-auto">
              YC
            </span>
          )}

          {/* ปุ่ม Hamburger Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors absolute right-2 top-6"
            style={{
              right: isSidebarOpen ? "1rem" : "50%",
              transform: isSidebarOpen ? "none" : "translateX(50%)",
            }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isSidebarOpen ? item.name : ""}
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${
                  isActive
                    ? "bg-admin-primary text-admin-secondary shadow-lg shadow-blue-900/40 font-bold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              {/* Active Indicator Bar */}
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-admin-secondary rounded-r-full" />
                  )}
                  <div
                    className={`min-w-[24px] flex justify-center ${isActive ? "text-admin-secondary" : "group-hover:text-admin-secondary transition-colors"}`}
                  >
                    {item.icon}
                  </div>

                  {/* Text (ซ่อนถ้ายุบ) */}
                  <div
                    className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 w-0 hidden"}`}
                  >
                    {item.name}
                  </div>

                  {/* Arrow Icon for Active State */}
                  {isActive && isSidebarOpen && (
                    <ChevronRight size={16} className="ml-auto opacity-50" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-gray-700/50 bg-black/20">
          <button
            onClick={logout}
            className={`flex items-center gap-4 w-full px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group ${!isSidebarOpen && "justify-center"}`}
            title="Logout"
          >
            <LogOut
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 min-h-screen flex flex-col
        ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-8 bg-admin-card/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-40 shadow-sm">
          <h2 className="text-gray-300 text-lg font-medium hidden sm:block">
            Admin Management System
          </h2>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-white text-sm font-bold">{user?.name}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-admin-primary border-2 border-admin-secondary flex items-center justify-center text-admin-secondary font-black shadow-lg shadow-admin-secondary/20">
              G
            </div>
          </div>
        </header>

        {/*  Outlet เจาะรูให้เนื้อหาลูกๆ โผล่ตรงนี้ */}
        <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
