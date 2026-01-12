import ProductCard from "./ProductCard"; // อย่าลืม Import Card ของคุณมา
import type { Product } from "../types/product";
interface ProductGridProps {
  products: Product[]; // รับรายการสินค้าที่ Filter มาแล้ว
}

const ProductGrid = ({ products }: ProductGridProps) => {
  // เช็คก่อนว่ามีของไหม? (Empty State)
  if (!products || products.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 mb-2 opacity-50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  // ถ้ามีของ ก็โชว์ Grid เลย
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        // ส่ง product เข้าไปใน Card
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
