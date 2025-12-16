import { Link } from "react-router-dom";
import type { Product } from "../types/product";
// สร้าง Interface สำหรับ Props
// บอกว่า Component นี้รับของชื่อ "product" ซึ่งมีหน้าตาแบบ Type "Product" นะ
interface ProductCardProps {
  product: Product;
}
const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div
      className="bg-white rounded-b-lg shadow-[5px_5px_5px_rgba(0,0,0,0.25)] overflow-hidden group w-full
    transition-shadow duration-300 hover:shadow-xl hover:-translate-y-2"
    >
      <Link
        to={`/shop/${product.category}/${product.id}`}
        className="h-[350px]"
      >
        <img src={product.image_url} alt={product.product_name} />
      </Link>

      <div className="p-4 ">
        <div className="flex justify-between">
          {" "}
          <p className="text-cardtitleprimary text-text_primary">
            {product.product_name}
          </p>
          <p className="text-cardtitlesecondary text-text_secondary">
            {product.price} ฿
          </p>
        </div>
        <div className="flex mt-2 -space-x-2 overflow-hidden p-1">
          {product.available_colors_code.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color }}
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
