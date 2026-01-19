// pages/Setting/SettingLayout.tsx
import { Outlet, NavLink } from "react-router-dom";

export default function SettingLayout() {
  // สไตล์สำหรับปุ่มตอน Active (มันจะเช็ค URL ให้เองอัตโนมัติ!)
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 p-3 rounded-lg transition-all ${
      isActive
        ? "text-yellow-500 font-bold bg-yellow-50"
        : "text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8 font-kanit">
      {/* Sidebar: มือถือเต็มจอ (w-full) | คอม 1/4 (w-1/4) */}
      <aside className="w-full md:w-1/4 bg-white p-4 md:p-6 rounded-xl shadow-sm h-fit">
        {/* Profile Section: จัดให้ดูดีในมือถือ */}
        <div className="flex md:block items-center gap-4 mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full md:mx-auto shrink-0"></div>
          <div className="text-left md:text-center">
            <h3 className="font-bold text-lg text-gray-800">Gunner</h3>
            <p className="text-sm text-gray-400">Member</p>
          </div>
        </div>

        {/* Menu Nav: มือถือให้เลื่อนซ้ายขวาได้ (Scroll) หรือเรียงลงมาก็ได้ */}
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
          <NavLink to="account" className={getLinkClass}>
            👤 <span className="hidden md:inline">My Account</span>{" "}
            <span className="md:hidden">Profile</span>
          </NavLink>
          <NavLink to="addresses" className={getLinkClass}>
            📍 <span className="hidden md:inline">Addresses</span>{" "}
            <span className="md:hidden">Address</span>
          </NavLink>
          <NavLink to="orders" className={getLinkClass}>
            📄 Orders
          </NavLink>

          {/* ปุ่ม Logout ดันไปขวาสุดในมือถือ */}
          <button className="text-red-400 p-3 hover:bg-red-50 rounded-lg md:mt-4 md:w-full text-left md:text-left ml-auto md:ml-0">
            🚪 <span className="hidden md:inline">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="w-full md:w-3/4 bg-white p-4 md:p-8 rounded-xl shadow-lg border border-gray-100 min-h-[500px]">
        <Outlet />
      </main>
    </div>
  );
}
