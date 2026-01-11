import { useRef } from "react";
import arrowLeftIcon from "../assets/icons/arrow-left.png";
import arrowRightIcon from "../assets/icons/arrow-right.png";
import ProductCard from "./ProductCard";
import { useProduct } from "../contexts/ProductContext";
interface FeaturedSliderProps {
  currentProductId?: number;
}
const FeaturedSlider = ({ currentProductId }: FeaturedSliderProps) => {
  const { products, loading, error } = useProduct();
  const sliderRef = useRef<HTMLDivElement>(null);

  // product ที่จะโชว์
  let displayProducts = [];

  // สำหรับแนะนำสินค้า
  if (currentProductId) {
    displayProducts = products
      .filter((item) => item.id !== currentProductId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  } else {
    displayProducts = products.slice(0, 10);
  }

  // ฟังก์ชันกดปุ่มแล้วเลื่อน
  const slideLeft = () => {
    if (sliderRef.current) {
      // เลื่อนไปทางซ้าย (ประมาณ 1 การ์ด)
      sliderRef.current.scrollLeft -= 320;
    }
  };

  // เช็คสถานะก่อนโชว์
  if (loading)
    return <div className="text-center py-20">LOADING..........</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  const slideRight = () => {
    if (sliderRef.current) {
      if (sliderRef.current) {
        // เลื่อนไปทางขวา (ประมาณ 1 การ์ด)
        sliderRef.current.scrollLeft += 320;
      }
    }
  };
  return (
    <div>
      <div className="relative group">
        {/* --- ปุ่มซ้าย (โผล่เมื่อ Hover) --- */}
        <button
          onClick={slideLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white p-1 rounded-full shadow-lg text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
        >
          <img src={arrowLeftIcon} alt="arrowLeftIcon.png" className="pr-1" />
        </button>

        {/* --- ตัวรางเลื่อน (Slider Container) --- */}
        <div
          ref={sliderRef}
          className="flex gap-[100px] overflow-x-auto scroll-smooth no-scrollbar py-4 px-2 snap-x snap-mandatory ml-[85px]"
        >
          {displayProducts.map((product) => (
            // กำหนดความกว้างการ์ดตรงนี้ (min-w)
            // บนจอคอม: 1/3 ของจอ (โชว์ 3 การ์ด) หรือจะ fix px ก็ได้
            // ในที่นี้ผมแนะนำ Fix px จะคุมง่ายกว่าสำหรับ Slider
            <div
              key={product.id}
              className="min-w-[280px] md:min-w-[350px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* --- ปุ่มขวา --- */}
        <button
          onClick={slideRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white p-1 rounded-full shadow-lg text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
        >
          <img src={arrowRightIcon} alt="arrowRightIcon.png" className="pl-1" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedSlider;
