// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "../src/routes/ProtectedRoute";
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
import SettingLayout from "./pages/setting/SettingPageLayout";
import MyAccount from "./pages/setting/MyAccountPage";
import Addresses from "./pages/setting/AddressesPage";
import Orders from "./pages/setting/OrdersPage";
import OrderDetail from "./pages/setting/OrderDetailPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminOrderList from "./pages/admin/AdminOrderList";
import AdminCatalog from "./pages/admin/AdminCatalog";
import AdminProductForm from "./pages/admin/AdminProductForm";
import HistoryGuard from "./routes/HistoryGuard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import ContactPage from "./pages/ContactPage";
import AdminSupportPage from "./pages/admin/AdminSupportPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        {/* ---โซน Admin only---- */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            {/* Redirect: ถ้าเข้า /admin เฉยๆ ให้เด้งไป /admin/dashboard */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrderList />} />
            <Route path="/admin/catalog" element={<AdminCatalog />} />
            <Route
              path="/admin/product/create"
              element={<AdminProductForm />}
            />
            <Route
              path="/admin/product/edit/:id"
              element={<AdminProductForm />}
            />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/support" element={<AdminSupportPage />} />
          </Route>
        </Route>
        {/* --------------- */}
        {/* User/Costumer ครอบด้วย MainLayout */}
        {/* ---โซนใครเข้าก็ได้--- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          {/* Shop */}
          <Route path="shop">
            <Route index element={<ShopPage />} />
            {/* :category คือตัวแปรที่เราตั้งชื่อขึ้นมาเอง */}
            <Route path=":category" element={<ShopPage />} />
            <Route path=":category/:id" element={<ProductDetailPage />} />
          </Route>
          {/* User */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify" element={<VerifyPage />} />
          <Route path="verified" element={<VerifiedPage />} />
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="resetpassword" element={<ResetPasswordPage />} />
          <Route path="about" element={<AboutPage />} />
          {/* -------------- */}
          {/* ---โซน Customer ต้อง Login ถึงจะเข้าได้--- */}
          <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="contact" element={<ContactPage />} />
            {/* Login */}
            <Route element={<HistoryGuard />}>
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>
            <Route path="/setting" element={<SettingLayout />}>
              {/* Redirect: เข้า /setting เฉยๆ ให้ดีดไป /setting/account */}
              <Route index element={<Navigate to="account" replace />} />

              {/* Child Routes: ไส้ในที่จะเปลี่ยนไปตาม URL */}
              <Route path="account" element={<MyAccount />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:orderId" element={<OrderDetail />} />
            </Route>
          </Route>
          {/* ---------------------------------------------------------- */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
