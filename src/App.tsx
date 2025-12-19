// src/App.tsx
import { Routes, Route, useParams } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// import layouts and pages
import MainLayout from "./layouts/MainLayout";
import Homepage from "./pages/HomePage";

// สร้างหน้า Mock โง่ๆ ไว้เทสก่อน (เดี๋ยวค่อยแยกไฟล์จริง)
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
const CartPage = () => <div className="text-xl">🛒 ตะกร้าสินค้า (รอทำ)</div>;
const AboutPage = () => <div className="text-xl">🔐 หน้า About (รอทำ)</div>;
const ContactPage = () => <div className="text-xl">🔐 หน้า Contact (รอทำ)</div>;

function App() {
  return (
    <Routes>
      {/* ครอบด้วย MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* หน้าลูกๆ ที่จะไปโผล่ตรง <Outlet /> */}
        <Route index element={<Homepage />} />
        {/* Shop */}
        <Route path="shop">
          <Route index element={<ShopPage />} />
          {/* :category คือตัวแปรที่เราตั้งชื่อขึ้นมาเอง */}
          <Route path=":category" element={<ShopPage />} />
        </Route>
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}

export default App;
