import { MapPin, Receipt, User } from "lucide-react";
import { Outlet, NavLink} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
export default function SettingLayout() {
  const { user, logout } = useAuth();
  let username;
  if (user) {
    username = user.username;
  }
  // สไตล์สำหรับปุ่มตอน Active (มันจะเช็ค URL ให้เองอัตโนมัติ!)
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 p-3 rounded-lg transition-all ${
      isActive
        ? "text-yellow-500 font-bold bg-yellow-50"
        : "text-gray-500 hover:bg-gray-100"
    }`;

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8 font-kanit">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-white p-4 md:p-6 rounded-xl shadow-sm h-fit">
        {/* Profile Section */}
        <div className="flex md:block items-center gap-4 mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-tertiary border-2 border-text_secondary flex items-center justify-center md:mx-auto shrink-0">
            <User className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
          </div>
          <div className="text-left md:text-center">
            <h3 className="font-bold text-lg text-gray-800">{username}</h3>
          </div>
        </div>

        {/* Menu Nav*/}
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
          <NavLink to="account" className={getLinkClass}>
            <User className="w-10 h-10 p-2 mr-2 rounded-full border border-gray-300 shadow-custombutton bg-white" />
            <span className="hidden md:inline">My Account</span>{" "}
            <span className="md:hidden">Profile</span>
          </NavLink>
          <NavLink to="addresses" className={getLinkClass}>
            <MapPin className="w-10 h-10 p-2 mr-2 rounded-full border border-gray-300 shadow-custombutton bg-white" />{" "}
            <span className="hidden md:inline">Addresses</span>{" "}
            <span className="md:hidden">Address</span>
          </NavLink>
          <NavLink to="orders" className={getLinkClass}>
            <Receipt className="w-10 h-10 p-2 mr-2 rounded-full border border-gray-300 shadow-custombutton bg-white" />{" "}
            Orders
          </NavLink>

          {/* ปุ่ม Logout ดันไปขวาสุดในมือถือ */}
          <button
            className="text-red-400 p-3 hover:bg-red-50 rounded-lg md:mt-4 md:w-full text-left md:text-left ml-auto md:ml-0"
            onClick={() => handleLogout()}
          >
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
