import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import AuthModal from "./AuthModal";
import accountIcon from "../assets/account_icon.png";
import { useCart } from "../contexts/CartContext";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : "U";
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Styles
  const getMenuClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "text-secondary border-b-2 border-secondary pb-1"
      : "text-white hover:text-secondary transition pb-1";
  };

  const iconLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? `p-2 rounded-full text-white border-2 border-secondary transition-all duration-300`
      : `p-2 rounded-full text-white border-2 border-transparent transition-all duration-300 hover:border-secondary`;
  };

  // Search Logic
  const handleSearchExecute = () => {
    if (searchText.trim() !== "") {
      navigate(`/shop?search=${encodeURIComponent(searchText.trim())}`);
      setIsSearchOpen(false); // ปิด search
      setIsMobileMenuOpen(false); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchExecute();
    }
  };

  const handleIconClick = () => {
    // Toggle เปิด/ปิด Search
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      // ถ้าเปิด Search ให้ปิด Menu มือถือด้วยจะได้ไม่รก
      setIsMobileMenuOpen(false); 
    } else {
      // ถ้าเปิดอยู่แล้ว แล้วมี text -> ค้นหาเลย
      if (searchText.trim() !== "") {
        handleSearchExecute();
      } else {
        // ไม่มี text -> ปิด
        setIsSearchOpen(false);
      }
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50 font-kanit transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        
        {/* --- Main Row --- */}
        <div className="flex justify-between items-center">
          
          {/* 1. Logo */}
          <Link
            to="/"
            className="text-3xl lg:text-5xl text-secondary font-logo mt-2 mb-2 transition-all duration-300 flex-shrink-0"
            onClick={() => {
               setIsMobileMenuOpen(false);
               setIsSearchOpen(false);
            }}
          >
            <span>YourCloth</span>
          </Link>

          {/* 2. Desktop Menu (🔥 เปลี่ยนเป็น hidden lg:flex) */}
          <div className="hidden lg:flex space-x-8 text-white text-xl font-kanit justify-center">
            <NavLink to="/" className={getMenuClass} end>Home</NavLink>
            <NavLink to="/shop" className={getMenuClass}>Shop</NavLink>
            <NavLink to="/about" className={getMenuClass}>About Us</NavLink>
            <NavLink to="/contact" className={getMenuClass}>Contact Us</NavLink>
          </div>

          {/* 3. Icons / Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            
            {/* 🔍 Desktop Search Input (🔥 เปลี่ยนเป็น hidden lg:block) */}
            {/* โชว์เฉพาะจอใหญ่ (1024px ขึ้นไป) */}
            <input
              type="text"
              placeholder="Search..."
              className={`
                hidden lg:block 
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

            {/* Search Icon Button */}
            <button
              onClick={handleIconClick}
              className={`transition-all duration-300 rounded-full p-1.5 md:p-2 active:scale-95 ${
                isSearchOpen ? "bg-primary/10 text-black" : "bg-transparent text-secondary hover:scale-105"
              }`}
            >
              <Search className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
            </button>

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                <button className="focus:outline-none p-1">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary text-primary text-base md:text-lg flex items-center justify-center shadow-md border-2 border-white">
                    {firstLetter}
                  </div>
                </button>
                {/* Dropdown (โชว์เฉพาะจอใหญ่ จอเล็กไปอยู่ในเมนู) */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-0 w-48 bg-white text-bodyxl rounded-xl shadow-xl py-2 z-20 border border-gray-100 overflow-hidden hidden lg:block">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm text-primary truncate">{user?.username}</p>
                    </div>
                    <Link to="/setting/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-secondary">Account</Link>
                    <Link to="/setting/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-secondary">Addresses</Link>
                    <Link to="/setting/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-secondary">Orders</Link>
                    <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className={iconLinkClass}>
                <img src={accountIcon} alt="Account" className="w-[30px] md:w-[50px]" />
              </NavLink>
            )}

            {/* Cart Icon */}
            <NavLink to="/cart" onClick={handleCartClick} className="relative group p-1.5 md:p-2 rounded-full transition-all duration-300">
              <ShoppingCart className="w-5 h-5 md:w-7 md:h-7 mr-2 text-secondary hover:scale-105 transition-colors" strokeWidth={2.5} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 flex mr-2 h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-bounce-short">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </NavLink>

            {/* Hamburger */}
            <button
              className="lg:hidden text-secondary p-1 hover:bg-white/10 rounded-md transition-colors"
              onClick={() => {
                 setIsMobileMenuOpen(!isMobileMenuOpen);
                 setIsSearchOpen(false); // ปิด search ถ้ากดเมนู
              }}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
        {/* โชว์เฉพาะจอเล็กกว่า 1024px (lg:hidden) */}
        {isSearchOpen && (
          <div className="lg:hidden w-full mt-3 pb-2 animate-in slide-in-from-top-2 fade-in duration-200">
             <div className="relative">
                <input 
                  type="text"
                  autoFocus // กดปุ๊บ พิมพ์ได้เลย
                  placeholder="Search products..."
                  className="w-full bg-white text-black border border-gray-300 rounded-full px-4 py-2 pl-10 outline-none shadow-inner text-sm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                
                {/* ปุ่มปิด search เล็กๆ */}
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
                >
                   <X className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}

        {/* Mobile/Tablet Menu Dropdown */}
        {/* โชว์เฉพาะจอเล็กกว่า 1024px (lg:hidden) */}
        {isMobileMenuOpen && (
          <div className="z-[999] lg:hidden mt-4 pb-4 animate-in slide-in-from-top-5 duration-200 border-t border-white/20 pt-4">
            <div className="flex flex-col space-y-4 text-center text-lg">
              <NavLink to="/" className={({isActive}) => isActive ? "text-secondary font-bold" : "text-white"} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
              <NavLink to="/shop" className={({isActive}) => isActive ? "text-secondary font-bold" : "text-white"} onClick={() => setIsMobileMenuOpen(false)}>Shop</NavLink>
              <NavLink to="/about" className={({isActive}) => isActive ? "text-secondary font-bold" : "text-white"} onClick={() => setIsMobileMenuOpen(false)}>About Us</NavLink>
              <NavLink to="/contact" className={({isActive}) => isActive ? "text-secondary font-bold" : "text-white"} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink>
              
              {isAuthenticated && (
                <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                   <span className="text-gray-400 text-sm">Account Menu</span>
                   <Link to="/setting/account" className="text-white hover:text-secondary" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
                   <Link to="/setting/orders" className="text-white hover:text-secondary" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                   <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-400 font-bold">Logout</button>
                </div>
              )}
            </div>
          </div>
        )}

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