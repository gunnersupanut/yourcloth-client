import { Link } from "react-router-dom";
import {
  Crown,       // Head Wear
  Shirt,       // Tops
  Footprints,  // Shoes
  Watch,       // Accessories
} from "lucide-react";

const PantsIcon = ({ size = 24, className = "", strokeWidth = 2 }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 5v15a2 2 0 0 0 2 2h2l2-4 2 4h2a2 2 0 0 0 2-2V5" />
      <rect x="6" y="2" width="12" height="3" rx="1" />
    </svg>
  );
};

const Category = () => {
  const categories = [
    { id: 1, name: "Head Wear", icon: Crown, path: "/shop/headwear" },
    { id: 2, name: "Tops", icon: Shirt, path: "/shop/tops" },
    { id: 3, name: "Pants", icon: PantsIcon, path: "/shop/pants" },
    { id: 4, name: "Shoes", icon: Footprints, path: "/shop/shoes" },
    { id: 5, name: "Accessories", icon: Watch, path: "/shop/accessories" },
  ];

  return (
    // Grid Layout
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-4">
      {categories.map((cat) => (
        <Link
          to={cat.path}
          key={cat.id}
          className="group flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="
            relative 
            w-24 h-24 md:w-32 md:h-32  /* ขนาดวงกลม */
            bg-white 
            rounded-full 
            border-2 border-gray-800   /* ขอบสีเข้มตาม Design */
            flex items-center justify-center
            shadow-md                  /* เงาเบาๆ */
            transition-all duration-300
            
            /* Hover Effect: เด้งขึ้น + เงาเข้ม + ขอบสีเปลี่ยน */
            group-hover:-translate-y-2
            group-hover:shadow-xl
            group-hover:border-secondary
          ">
            {/* ตัวไอคอน */}
            <cat.icon
              size={48} 
              strokeWidth={1.5}
              className="text-secondary transition-transform duration-300 group-hover:scale-110" 
            />
          </div>

          <span className="
            mt-4 
            text-lg md:text-xl 
            font-bold 
            text-gray-800 
            font-kanit
            group-hover:text-secondary 
            transition-colors
          ">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Category;