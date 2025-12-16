import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import searchIcon from "../assets/search_icon.png";
import accountIcon from "../assets/account_icon.png";
import cartIcon from "../assets/cart_icon.png";
const Navbar = () => {
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false); // สวิตช์เปิด/ปิด
  const [searchText, setSearchText] = useState(""); // เก็บค่าที่พิมพ์
  const navigate = useNavigate();

  // เก็บ class style ของเมนูแต่ละอัน
  const getMenuClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "text-secondary border-b-2 border-secondary pb-1" // Active Style
      : "text-white hover:text-secondary transition pb-1"; // Inactive Style
  };

  // เก็บ class style ของไอคอน hover
  const iconClass = `p-2 rounded-full text-white border-2 transition-all duration-300 hover:border-secondary`;

  const iconLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? `p-2 rounded-full text-white border-2 border-secondary transition-all duration-300 ` // Active Style
      : `p-2 rounded-full text-white border-2 border-transparent transition-all duration-300 hover:border-secondary`; // Inactive Style
  };
  // ฟังก์ชันจัดการการกด Enter ในช่องค้นหา
  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("Search:", searchText);
      // navigate(`/search?q=${searchText}`); // เปิดบรรทัดนี้เมื่อมีหน้า Search จริง
      setIsSearchOpen(false); // ค้นเสร็จปิดกล่อง
      setSearchText(""); // ล้างคำค้น
    }
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
            placeholder="Search..."
            className={`
                    bg-white text-black placeholder-gray-300 outline-none
                    transition-all duration-300 ease-in-out rounded-[20px] p-1 
                    ${
                      isSearchOpen
                        ? "w-50 px-2 opacity-100"
                        : "w-0 px-0 opacity-0"
                    }
                `}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`${iconClass} ${
              isSearchOpen ? "border-secondary" : "border-transparent"
            }`}
          >
            <img src={searchIcon} alt="Search_Icon" className="w-[50px]" />
          </button>
          <NavLink to="/login" className={iconLinkClass}>
            <img src={accountIcon} alt="Account_Icon" className="w-[50px]" />
          </NavLink>
          {/* Cart Icon */}
          <NavLink to="/cart" className={iconLinkClass}>
            <img src={cartIcon} alt="Cart_Icon" className="w-[50px]" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
