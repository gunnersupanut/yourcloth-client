import { Link } from "react-router-dom";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // เช็คสต็อก
  const isOutOfStock = product.total_stock <= 0;

  return (
    <div
      className={`bg-white rounded-b-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] overflow-hidden group w-full
    transition-shadow duration-300 hover:shadow-xl hover:-translate-y-2 relative`}
    >
      <Link
        to={isOutOfStock ? "" : `/shop/${product.category}/${product.id}`}
        className={`block w-full h-[250px] sm:h-[350px] overflow-hidden relative ${isOutOfStock && "cursor-not-allowed"}`}
      >
        <img
          src={product.image_url}
          alt={product.product_name}
          // ถ้าของหมด ทำให้รูปขาวดำ + จางลงนิดนึง
          className={`w-[350px] h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            isOutOfStock ? "grayscale opacity-60" : ""
          }`}
        />

        {/* ป้าย Out of Stock แบบคาดกลาง  */}
        {isOutOfStock && (
          // inset-0 คือขยายเต็มพื้นที่, flex center คือจัดให้อยู่ตรงกลาง
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            {/* แถบสีแดง โปร่งแสงนิดหน่อย */}
            <div className="bg-red-600/90 text-white text-lg font-bold w-full text-center py-3 tracking-wider shadow-md backdrop-blur-sm">
              OUT OF STOCK
            </div>
          </div>
        )}
      </Link>

      <div className="p-4 ">
        <div className="flex justify-between">
          <p className="text-cardtitleprimary text-text_primary">
            {product.product_name}
          </p>
          <p className="text-cardtitlesecondary text-text_secondary">
            {product.price} ฿
          </p>
        </div>
        <div className="flex mt-2 -space-x-2 overflow-hidden p-1">
          {product.available_colors.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color.code }}
              className="w-6 h-6 rounded-full border-2
               border-white
               shadow-sm ring-1 ring-inset ring-black/10"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
