import { useParams } from "react-router-dom";

const ShopPage = () => {
  // ดึงค่า category มาจาก URL
  // ถ้าเข้า /shop -> category จะเป็น undefined
  // ถ้าเข้า /shop/men -> category จะเป็น "men"
  const { category } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {category ? `สินค้าหมวด: ${category.toUpperCase()}` : "สินค้าทั้งหมด"}
      </h1>

      {/* เดี๋ยวเราค่อยส่ง category นี้ไปยิง API Backend */}
      <p>กำลังแสดงสินค้าในหมวด: {category || "All"}</p>
    </div>
  );
};
export default ShopPage;
