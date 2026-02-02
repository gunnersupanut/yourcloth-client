import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bannerService } from "../services/bannerService";
import type { IBanner } from "../types/bannerTypes";
import { Loader2 } from "lucide-react";

// Import รูปเดิมของนาย
import arrowLeftIcon from "../assets/icons/arrow-left.png";
import arrowRightIcon from "../assets/icons/arrow-right.png";

const Banner = () => {
  const [banners, setBanners] = useState<IBanner[]>([]); // เก็บข้อมูลจริง
  const [loading, setLoading] = useState(true); // สถานะโหลด
  const [current, setCurrent] = useState(0);

  // 1. ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const data = await bannerService.getPublicBanners();
        setBanners(data);
      } catch (error) {
        console.error("Failed to load banners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const length = banners.length;

  // 2. ฟังก์ชัน Slide (เหมือนเดิม แต่ปรับปรุง Logic นิดหน่อย)
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  // 3. Auto Slide (แก้บั๊กให้ Reset Timer เมื่อ current เปลี่ยน)
  useEffect(() => {
    if (length <= 1) return; // ถ้ารูปเดียวไม่ต้องเลื่อน

    const timer = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => clearTimeout(timer); // Clear เมื่อ Component unmount หรือ slide เปลี่ยน
  }, [current, length]);

  // --- 🌀 LOADING STATE ---
  if (loading) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-gray-900 flex flex-col justify-center items-center text-gray-500 animate-pulse">
        <Loader2 className="w-12 h-12 animate-spin mb-2 text-secondary" />
        <p className="font-kanit text-lg">Loading Promotion...</p>
      </div>
    );
  }

  // --- ❌ EMPTY STATE (กันหน้าแตก) ---
  if (banners.length === 0) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-gray-800 flex flex-col justify-center items-center text-white relative overflow-hidden">
        {/* ใส่รูป Placeholder ตรงนี้ได้ถ้าต้องการ */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-primary opacity-80"></div>
        <h2 className="text-4xl font-bold z-10 font-logo tracking-wider">
          WELCOME TO SHOP
        </h2>
        <Link
          to="/shop"
          className="mt-6 px-8 py-3 bg-secondary text-primary font-bold rounded-full z-10 hover:scale-105 transition"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-800 group">
      {/* ส่วนแสดงภาพ (Loop) */}
      {banners.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image (ใช้ image_url จาก DB) */}
          <img
            src={slide.image_url}
            alt={slide.title || "Banner"}
            className="w-full h-full object-cover opacity-80" // ปรับ opacity นิดนึงให้ตัวหนังสือเด่น
          />

    
          <Link
            to="/shop"
            className="
                  absolute
                  /* Mobile: จัดกึ่งกลางด้านล่าง */
                  bottom-10 left-1/2 -translate-x-1/2
                  /* Desktop (md ขึ้นไป): ย้ายไปมุมขวาล่าง */
                  md:right-10 md:left-auto md:translate-x-0

                  /* Styling */
                  bg-secondary text-primary
                  px-12 py-4 rounded-full
                  font-bold text-xl
                  shadow-lg
                  
                  /* Animation: ชี้แล้วเด้ง */
                  hover:scale-105 hover:shadow-xl hover:bg-yellow-300
                  transition-all duration-300
                  flex justify-center items-center
                  z-20
                "
          >
            <span className="text-primary text-button">Shop Now</span>
          </Link>
        </div>
      ))}

      {/* --- ปุ่มลูกศร (ย้ายออกมาอยู่นอก Map เพื่อ Performance) --- */}
      {length > 1 && (
        <>
          <button
            className="absolute top-1/2 left-4 z-20 bg-black/30 hover:bg-secondary hover:text-primary p-2 rounded-full hidden group-hover:block transition backdrop-blur-sm -translate-y-1/2"
            onClick={prevSlide}
          >
            <img
              src={arrowLeftIcon}
              alt="Previous"
              className="w-6 h-6 object-contain invert hover:invert-0 transition"
            />
          </button>

          <button
            className="absolute top-1/2 right-4 z-20 bg-black/30 hover:bg-secondary hover:text-primary p-2 rounded-full hidden group-hover:block transition backdrop-blur-sm -translate-y-1/2"
            onClick={nextSlide}
          >
            <img
              src={arrowRightIcon}
              alt="Next"
              className="w-6 h-6 object-contain invert hover:invert-0 transition"
            />
          </button>
        </>
      )}

      {/* Dots Indicators (แถมให้ จะได้รู้ว่าอยู่หน้าไหน) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 cursor-pointer rounded-full shadow-md ${
              current === idx
                ? "bg-secondary w-8 h-2"
                : "bg-white/50 hover:bg-white w-2 h-2"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
