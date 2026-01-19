// pages/Setting/SettingLayout.tsx
import { Outlet, NavLink } from 'react-router-dom';

export default function SettingLayout() {
  // สไตล์สำหรับปุ่มตอน Active (มันจะเช็ค URL ให้เองอัตโนมัติ!)
  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-2 p-3 rounded-lg transition-all ${
      isActive ? 'text-yellow-500 font-bold bg-yellow-50' : 'text-gray-500 hover:bg-gray-100'
    }`;

  return (
    <div className="container mx-auto p-6 flex gap-8">
      {/* 👈 Sidebar (อยู่กับที่ตลอด) */}
      <aside className="w-1/4 bg-white p-6 rounded-xl shadow-sm h-fit">
        <div className="text-center mb-6">
           {/* รูป Profile User */}
           <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2"></div>
           <h3 className="font-bold text-lg">Gunner</h3>
        </div>

        <nav className="flex flex-col gap-2">
          {/* 🔥 ใช้ NavLink แทน button/a */}
          <NavLink to="account" className={getLinkClass}>
             👤 My Account
          </NavLink>
          <NavLink to="addresses" className={getLinkClass}>
             📍 Addresses
          </NavLink>
          <NavLink to="orders" className={getLinkClass}>
             📄 Orders
          </NavLink>
          
          <button className="text-red-400 mt-4 text-left p-3 hover:bg-red-50 rounded-lg">
            Logout
          </button>
        </nav>
      </aside>

      {/* 👉 Content Area (เปลี่ยนตาม URL) */}
      <main className="w-3/4 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <Outlet /> {/* 🕳️ นี่คือรูที่เนื้อหาจะมาโผล่ */}
      </main>
    </div>
  );
}