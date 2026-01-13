// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/ProtectedRoute";
// import layouts and pages
import MainLayout from "./layouts/MainLayout";
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/userPage/LoginPage";
import RegisterPage from "./pages/userPage/RegisterPage";
import VerifyPage from "./pages/userPage/VerifyPage";
import VerifiedPage from "./pages/userPage/VerifiedPage";
import ForgotPasswordPage from "./pages/userPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/userPage/ResetPasswordPage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";

const CartPage = () => <div className="text-xl">🛒 ตะกร้าสินค้า (รอทำ)</div>;
const AboutPage = () => <div className="text-xl">🔐 หน้า About (รอทำ)</div>;
const ContactPage = () => <div className="text-xl">🔐 หน้า Contact (รอทำ)</div>;

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
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
            <Route path="/shop/:category/:id" element={<ProductDetailPage />} />
          </Route>
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
          {/* User */}
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify" element={<VerifyPage />} />
          <Route path="verified" element={<VerifiedPage />} />
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="resetpassword" element={<ResetPasswordPage />} />

          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
