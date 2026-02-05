import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full mt-14">
      {/* --- ส่วนบน (เนื้อหาหลัก) สีม่วงเข้ม --- */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* === Column 1 Brand Info === */}
            <div className="flex flex-col space-y-4 md:border-r border-secondary py-10 px-5 font-logo">
              {/* Logo ใหญ่ */}
              <h1 className="text-5xl text-secondary">YourCloth</h1>
              {/* Slogan */}
              <div className="text-[32px] font-semibold ">
                <p>Your Style.</p>
                <p className="text-secondary font-semibold">Your Cloth.</p>
              </div>
            </div>

            {/* === Column 2: Help === */}
            <div className="flex flex-col space-y-4 md:border-r border-secondary py-10 px-5 font-kanit">
              <h3 className="text-h3xl text-secondary">Help</h3>
              <ul className="space-y-2 text-bodyxl">
                <li>
                  <Link to="/" className="hover:text-secondary transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-secondary transition"
                  >
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/setting/account"
                    className="hover:text-secondary transition"
                  >
                    Acoount
                  </Link>
                </li>
              </ul>
            </div>

            {/* === Column 3: Shop === */}
            <div className="flex flex-col space-y-4 py-10 px-5 font-kanit">
              <h3 className="text-h3xl text-secondary">Shop</h3>
              <div className="grid grid-cols-2 gap-4 text-lg">
                {/* ซ้าย */}
                <ul className="space-y-2 text-bodyxl">
                  <li>
                    <Link
                      to="/shop/Head Wear"
                      className="hover:text-secondary transition"
                    >
                      Head Wear
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop/Tops"
                      className="hover:text-secondary transition"
                    >
                      Tops
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop/Pants"
                      className="hover:text-secondary transition"
                    >
                      Pants
                    </Link>
                  </li>
                </ul>
                {/* ขวา */}
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/shop/Shoes"
                      className="hover:text-secondary transition"
                    >
                      Shoes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop/Accessories"
                      className="hover:text-secondary transition"
                    >
                      Accessories
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* 🔥 Column 4 Social ลบทิ้งไปแล้ว! */}
          </div>
        </div>
      </div>

      {/* --- ส่วนล่าง (Credit) สีม่วงจางลง --- */}
      <div className="bg-tertiary text-white py-4 text-sm font-light">
        <div className="container mx-auto p-3 pl-10 flex flex-col md:flex-row justify-start items-center space-y-2 gap-8 md:space-y-0 font-kanit">
          <div className="flex items-center space-x-2">
            <span>© 2025</span>
            <span className="text-secondary font-bold">Your Cloth</span>
          </div>

          <div className="flex space-x-8">
            <span>Icon By Lucide</span>
            <span>Images From Pexels, Pixabay, unsplash & Gemini</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
