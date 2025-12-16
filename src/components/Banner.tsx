import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import arrowLeftIcon from "../assets/icons/arrow-left.png";
import arrowRightIcon from "../assets/icons/arrow-right.png";
const MockBanner = [
  {
    id: 1,
    image: "/mockbanner/banner1.png",
  },
  {
    id: 2,
    image: "/mockbanner/banner2.png",
  },
  {
    id: 3,
    image: "/mockbanner/banner3.png",
  },
];
const Banner = () => {
  const [current, setCurrent] = useState(0); // เก็บ index ของภาพปัจจุบัน (0, 1, 2)
  const length = MockBanner.length;
  // ฟังก์ชันกด "ถัดไป"
  const nextSlide = () => {
    // ถ้าปัจจุบัน == ตัวสุดท้าย (length - 1) ? ให้กลับไป 0 : ถ้าไม่ ก็บวก 1
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  // ฟังก์ชันกด "ก่อนหน้า"
  const prevSlide = () => {
    // ถ้าปัจจุบัน == 0 ? ให้กระโดดไปตัวสุดท้าย : ถ้าไม่ ก็ลบ 1
    setCurrent(current === 0 ? length - 1 : current - 1);
  };
  // เลื่อนไปทุกๆ 5 วินาที
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000);
    return () => clearTimeout(timer); // ล้าง Timer เมื่อกดเปลี่ยนเองหรือ Component หาย
  });
  //  ถ้าไม่มีข้อมูล Banner จะไม่ต้องโชว์อะไร
  if (MockBanner.length <= 0) {
    return null; // ถ้าไม่มีข้อมูล ไม่ต้องโชว์อะไร
  }
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-800 group">
      {/* ส่วนแสดงภาพ */}
      {MockBanner.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          {index === current && (
            <img
              src={slide.image}
              className="w-full h-full object-cover opacity-70"
            />
          )}
          {/* button */}

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
  "
          >
            <span className="text-primary text-button">Shop Now</span>
          </Link>

          {/* ปุ่มลูกศรซ้าย-ขวา */}
          <button
            className="absolute top-1/2 left-4 z-20 bg-white/20 hover:bg-white/50 p-1 rounded-full hidden group-hover:block transition "
            onClick={prevSlide}
          >
            <img src={arrowLeftIcon} alt="ArrowLeftIcon.png" className="pr-1"/>
          </button>
          <button
            className="absolute top-1/2 right-4 z-20  bg-white/20 hover:bg-white/50 p-1 rounded-full hidden group-hover:block transition "
            onClick={nextSlide}
          >
            <img src={arrowRightIcon} alt="ArrowRightIcon.png" className="pl-1"/>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Banner;
