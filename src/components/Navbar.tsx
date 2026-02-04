import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import AuthModal from "./AuthModal";
// import Icon
import accountIcon from "../assets/account_icon.png";
import { useCart } from "../contexts/CartContext";
import { Search, ShoppingCart } from "lucide-react";

const Navbar = () => {
  // ดึง user กับ logout มาใช้ได้เลย (ไม่ต้องเขียน logic แกะ token แล้ว)
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const firstLetter = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // UserDropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false); // สวิตช์เปิด/ปิด
  const [searchText, setSearchText] = useState(""); // เก็บค่าที่พิมพ์

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // เก็บ class style ของเมนูแต่ละอัน
  const getMenuClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "text-secondary border-b-2 border-secondary pb-1" // Active Style
      : "text-white hover:text-secondary transition pb-1"; // Inactive Style
  };

  const iconLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? `p-2 rounded-full text-white border-2 border-secondary transition-all duration-300 ` // Active Style
      : `p-2 rounded-full text-white border-2 border-transparent transition-all duration-300 hover:border-secondary`; // Inactive Style
  };
  // ฟังก์ชันจัดการการกด Enter ในช่องค้นหา
  // แยก Logic ค้นหาออกมาเป็นฟังก์ชัน (จะได้เรียกใช้ทั้งตอนกด Enter และกดปุ่ม)
  const handleSearchExecute = () => {
    if (searchText.trim() !== "") {
      navigate(`/shop?search=${encodeURIComponent(searchText.trim())}`);
      setIsSearchOpen(false);
      // setSearchText(""); // (Optional) ถ้าอยากให้ค้นเสร็จแล้วล้างข้อความ ก็เปิดบรรทัดนี้
    }
  };

  //  ฟังก์ชันกด Enter (เรียกใช้ตัวข้างบน)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchExecute();
    }
  };

  // ฟังก์ชันปุ่มแว่นขยาย (The Smart Button)
  const handleIconClick = () => {
    if (!isSearchOpen) {
      // ถ้าปิดอยู่ -> ให้เปิด
      setIsSearchOpen(true);
    } else {
      // ถ้าเปิดอยู่...
      if (searchText.trim() !== "") {
        // มีข้อความ -> ค้นหาเลย
        handleSearchExecute();
      } else {
        // ไม่มีข้อความ 
        setIsSearchOpen(false);
      }
    }
  };
  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      // อย่าเพิ่งเปลี่ยนหน้า
      e.preventDefault();
      // เปิด Modal ขึ้นมาเคลียร์กันก่อน
      setIsAuthModalOpen(true);
    }
    // ถ้า Logged In แล้ว มันจะทำงานตามปกติ (ไปหน้า /cart)
  };
  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50 ">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center ">
        {/* Logo */}
        <Link
          to="/"
          className="text-4xl md:text-6xl lg:text-5xl text-secondary font-logo mt-4 mb-4 transition-all duration-300"
        >
          <span>YourCloth</span>
        </Link>

        {/* Search */}
        {/* Menu Links */}
        <div className="hidden md:flex space-x-10 text-white text-2xl font-kanit justify-center">
          <NavLink to="/" className={getMenuClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={getMenuClass}>
            Shop
          </NavLink>
          <NavLink to="/about" className={getMenuClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={getMenuClass}>
            Contact Us
          </NavLink>
        </div>

        {/* Icons / Actions */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search 'Hoodie', 'Black', 'Oversize'..."
            className={`
           bg-white text-black placeholder-gray-400 outline-none border border-gray-200
           transition-all duration-300 ease-in-out rounded-full py-2
           shadow-sm text-sm
           ${
             isSearchOpen
               ? "w-[220px] px-4 opacity-100 ml-2"
               : "w-0 px-0 opacity-0 border-none"
           }
        `}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Search Button (Smart Button) */}
          <button
            onClick={handleIconClick}
            className={`
    transition-all duration-300 rounded-full p-2 active:scale-95
    ${
      isSearchOpen
        ? "bg-primary/10 text-black"
        : "bg-transparent text-secondary hover:scale-105"
    } 
  `}
            title={
              isSearchOpen && searchText ? "Click to Search" : "Open Search"
            }
          >
            {/* ใช้ Component Search แทน img */}
            {/* strokeWidth={2.5} คือทำให้เส้นหนาขึ้นหน่อย ดูเท่ๆ */}
            <Search className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
          </button>
          {isAuthenticated ? (
            // Login แล้ว
            <div className="flex items-center gap-4">
              {/* Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-secondary text-primary text-lg flex items-center justify-center shadow-md border-2 border-white">
                    {firstLetter}
                  </div>
                </button>
                {/* DropdownMenu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-0 w-48 bg-white text-bodyxl rounded-xl shadow-xl py-2 z-20 border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm text-primary truncate">
                        {user?.username}
                      </p>
                    </div>

                    {/* Settings */}
                    <Link
                      to="/setting/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-secondary transition-colors"
                    >
                      Account
                    </Link>
                    <Link
                      to="/setting/addresses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-secondary transition-colors"
                    >
                      Addresses
                    </Link>
                    <Link
                      to="/setting/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-secondary transition-colors"
                    >
                      Orders
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <NavLink to="/login" className={iconLinkClass}>
              <img src={accountIcon} alt="Account_Icon" className="w-[50px]" />
            </NavLink>
          )}
          {/* Cart Icon */}
          <NavLink
            to="/cart"
            onClick={handleCartClick}
            className={`
    relative group p-2 rounded-full transition-all duration-300 
  `}
          >
            {/* ไอคอนตะกร้า */}
            <ShoppingCart
              className="w-6 h-6 md:w-7 md:h-7 text-secondary hover:scale-105 transition-colors"
              strokeWidth={2.5}
            />

            {/* ส่วนของ Badge (แจ้งเตือนจำนวน) */}
            {totalItems > 0 && (
              <span
                className="
      absolute top-0 right-0 
      flex h-5 w-5 items-center justify-center 
      rounded-full bg-red-600 
      text-[10px] font-bold text-white 
      shadow-sm ring-2 ring-white
      animate-bounce-short /* (Optional) เพิ่ม animation เด้งดึ๋งๆ ตอนตัวเลขเปลี่ยนจะเท่มาก */
    "
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </NavLink>
        </div>
        <AuthModal
          message="Login to view your cart"
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
