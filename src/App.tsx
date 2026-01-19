// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
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
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ScrollToTop from "./components/ScrollToTop";
import SettingLayout from "./pages/setting/SettingLayout";
import MyAccount from "./pages/setting/MyAccount";
import Addresses from "./pages/setting/Addresses";
import Orders from "./pages/setting/Orders";
const AboutPage = () => <div className="text-xl">🔐 หน้า About (รอทำ)</div>;
const ContactPage = () => <div className="text-xl">🔐 หน้า Contact (รอทำ)</div>;

function App() {
  return (
    <>
      <ScrollToTop />
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
          <Route path="login" element={<LoginPage />} />
          {/* User */}
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify" element={<VerifyPage />} />
          <Route path="verified" element={<VerifiedPage />} />
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="resetpassword" element={<ResetPasswordPage />} />

          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route element={<ProtectedRoute />}>
            {/* โซน ต้อง Login ถึงจะเข้าได้ */}
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />{" "}
            <Route path="/setting" element={<SettingLayout />}>
              {/* Redirect: เข้า /setting เฉยๆ ให้ดีดไป /setting/account */}
              <Route index element={<Navigate to="account" replace />} />

              {/* Child Routes: ไส้ในที่จะเปลี่ยนไปตาม URL */}
              <Route path="account" element={<MyAccount />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
