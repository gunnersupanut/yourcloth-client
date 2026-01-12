import { Link } from "react-router-dom";
// import icon
import headWearIcon from "../assets/icons/icons8-cap-96 1.png";
import topsIcon from "../assets/icons/icons8-t-shirt-100 (1) 1.png";
import pantsIcon from "../assets/icons/icons8-pant-96 1.png";
import shoesIcon from "../assets/icons/icons8-sneaker-100 (1) 4.png";
import accessoriesIcon from "../assets/icons/icons8-bag-100 1.png";
const Category = () => {
  // ข้อมูลหมวดหมู่ (Config ทีเดียวจบ)
  const categories = [
    {
      id: 1,
      name: "Head Wear",
      icon: headWearIcon,
      path: "/shop/Head Wear",
    },
    { id: 2, name: "Tops", icon: topsIcon, path: "/shop/Tops" },
    { id: 3, name: "Pants", icon: pantsIcon, path: "/shop/Pants" },
    { id: 4, name: "Shoes", icon: shoesIcon, path: "/shop/Shoes" },
    {
      id: 5,
      name: "Accessories",
      icon: accessoriesIcon,
      path: "/shop/Accessories",
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.path}
            className="group flex flex-col items-center gap-4 cursor-pointer my-8 mb-10"
          >
            {/* --- วงกลม (Circle) --- */}
            <div
              className="
              w-[150px] h-[150px] rounded-full
              border-2 border-black bg-white 
              shadow-[5px_5px_5px_rgba(0,0,0,0.25)]
              flex items-center justify-center 
              transition-all duration-300
              
              /* Hover Effect: เปลี่ยนพื้นเป็นสีเหลือง ขอบเหลือง เงาเด้ง */
              group-hover:shadow-lg group-hover:-translate-y-1
            "
            >
              {/* --- ไอคอน (Icon) --- */}
              <div
                className="
                text-4xl md:text-5xl text-yellow-400 
                transition-colors duration-300
                
                /* Hover Effect: ไอคอนเปลี่ยนเป็นสีขาว */
                group-hover:text-white
              "
              >
                <img src={cat.icon} alt="Icon.png" />
              </div>
            </div>

            {/* --- ชื่อหมวด (Label) --- */}
            <span className="text-text_primary text-h3xl group-hover:text-secondary transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
