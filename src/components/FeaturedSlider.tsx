import { useRef, useEffect, useMemo } from "react";
import arrowLeftIcon from "../assets/icons/arrow-left.png";
import arrowRightIcon from "../assets/icons/arrow-right.png";
import ProductCard from "./ProductCard";
import { useProduct } from "../contexts/ProductContext";

interface FeaturedSliderProps {
  currentProductId?: number;
}

const FeaturedSlider = ({ currentProductId }: FeaturedSliderProps) => {
  const { products, loading, error, fetchProducts } = useProduct();
  const sliderRef = useRef<HTMLDivElement>(null);

  // 2. สั่งโหลดข้อมูล
  useEffect(() => {
    fetchProducts({ limit: 20, sort: "newest" });
  }, [fetchProducts]);

  // 3. เตรียมสินค้า
  const displayProducts = useMemo(() => {
    let filtered = products;
    if (currentProductId) {
      filtered = filtered.filter((item) => item.id !== currentProductId);
      return [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);
    }
    return filtered.slice(0, 10);
  }, [products, currentProductId]);

  // --- ฟังก์ชัน Slide (ปรับระยะให้สัมพันธ์กับ Card ใหม่) ---
  const scrollAmount = 380; // (Card ~350 + Gap ~30)

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= scrollAmount;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += scrollAmount;
    }
  };

  // --- Render State ---
  if (loading && products.length === 0)
    return <div className="text-center py-20 font-kanit animate-pulse text-gray-400">Loading recommendations...</div>;
  
  if (error)
    return <div className="text-center py-20 text-red-500 font-kanit">{error}</div>;

  if (!loading && displayProducts.length === 0) return null;

  return (
    <div className="w-full"> {/* เพิ่ม w-full คุมไว้ */}
      <div className="relative group">
        
        {/* --- ปุ่มซ้าย --- */}
        <button
          onClick={slideLeft}
          className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 p-3 rounded-full shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block transform hover:scale-110"
        >
          <img src={arrowLeftIcon} alt="Previous" className="w-5 h-5 opacity-70" />
        </button>

        {/* --- ตัวรางเลื่อน --- */}
        <div
          ref={sliderRef}
          className="
            flex 
            overflow-x-auto 
            scroll-smooth 
            no-scrollbar 
            py-8 px-4 md:px-2          
            snap-x snap-mandatory 
            
            gap-6 md:gap-10 lg:gap-12   
          "
        >
      {displayProducts.map((product) => (
            <div
              key={product.id}
              className="
                snap-center md:snap-start 
                shrink-0
                min-w-[230px]           /* จอ 320px: เอาแค่ 230px พอ เหลือที่หายใจ */
                xs:min-w-[260px]        /* จอมือถือทั่วไป: ขยับขึ้นมาหน่อย (ต้อง config tailwind xs เพิ่ม หรือใช้ sm แทนก็ได้) */
                sm:min-w-[280px]        /* จอใหญ่ขึ้นมาอีกนิด */
                md:min-w-[320px]        /* Tablet */
                lg:min-w-[350px]        /* Desktop */
              "
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* --- ปุ่มขวา --- */}
        <button
          onClick={slideRight}
          className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 p-3 rounded-full shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block transform hover:scale-110"
        >
          <img src={arrowRightIcon} alt="Next" className="w-5 h-5 opacity-70" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedSlider;