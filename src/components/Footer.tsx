import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full mt-14">
      {/* --- ส่วนบน (เนื้อหาหลัก) สีม่วงเข้ม --- */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4">
          {/* Grid Layout: มือถือ 1 ช่อง / จอคอม 4 ช่อง */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* === Column 1: Brand Info === */}
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
                  <Link
                    to="/contact"
                    className="hover:text-secondary transition"
                  >
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/return-policy"
                    className="hover:text-secondary transition"
                  >
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-secondary transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* === Column 3: Shop (แบ่ง 2 แถวภายใน) === */}
            <div className="flex flex-col space-y-4 md:border-r border-secondary py-10 px-5 font-kanit">
              <h3 className="text-h3xl text-secondary">Shop</h3>
              <div className="grid grid-cols-2 gap-4 text-lg">
                {/* ซ้าย */}
                <ul className="space-y-2 text-bodyxl">
                  <li>
                    <Link
                      to="/shop/headwear"
                      className="hover:text-secondary transition"
                    >
                      Head Wear
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop/tops"
                      className="hover:text-secondary transition"
                    >
                      Tops
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop/pants"
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
                      to="/shop/shoes"
                      className="hover:text-secondary transition"
                    >
                      Shoes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop/bags"
                      className="hover:text-secondary transition"
                    >
                      Bags
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* === Column 4: Social Media === */}
            <div className="flex flex-col items-center justify-center space-y-6 px-4">
              {/* Facebook (วงกลมสีฟ้า) */}
              <a
                href="https://www.facebook.com/supanut.ongcharoensuk"
                target="_blank" // สั่งให้เปิดแท็บใหม่
                rel="noopener noreferrer" // กุญแจล็อคความปลอดภัย "ป้องกันเว็บใหม่ไม่ให้มายุ่งกับเว็บเดิม ไม่ส่งข้อมูลว่าเรามาจากเว็บไหน"
                className="transform hover:scale-110 transition duration-300"
              >
                FB Icon
              </a>

              {/* Line (วงกลมสีเขียว) */}
              <a
                href="#"
                className="transform hover:scale-110 transition duration-300"
              >
                Line Icon
              </a>

              {/* Instagram (Gradient สีรุ้ง) */}
              <a
                href="#"
                className="transform hover:scale-110 transition duration-300"
              >
                {/* เทคนิคทำ Instagram Gradient ใน icon */}
                <div className="bg-gradient-to-tr from-sectext-secondary via-red-500 to-purple-600 p-1 rounded-xl">
                  Ig Icon
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* --- ส่วนล่าง (Credit) สีม่วงจางลง --- */}
      <div className="bg-tertiary text-white py-4 text-sm font-light">
        {" "}
        {/* ปรับสี bg ให้อ่อนลง */}
        <div className="container mx-auto p-3 pl-10 flex flex-col md:flex-row justify-start items-center space-y-2 gap-8 md:space-y-0 font-kanit">
          <div className="flex items-center space-x-2">
            <span>© 2025</span>
            <span className="text-secondary font-bold">Your Cloth</span>
          </div>

          <div className="flex space-x-8">
            <span>Icon By Icon8</span>
            <span>Images From Pexels & Gemini</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
