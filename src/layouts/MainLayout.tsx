import { Outlet, useLocation } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";

const MainLayout = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  // เช็คว่าอยู่หน้า Cart/Checkout ไหม
  const isCartPage = location.pathname === "/cart";
  const isCheckoutPage = location.pathname === "/checkout";
  const hasStickyFooter = isCartPage || isCheckoutPage;
  if (isAdminPath) {
    return <Outlet />;
  }
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav(Header) */}
      <Navbar />

      {/* ส่วนเนื้อหา (เจาะรูด้วย Outlet) */}
      <main className="flex-grow mx-auto w-full">
        <Breadcrumbs />
        <Outlet />
      </main>

      {/* Footer*/}
      <div className={`${hasStickyFooter && "pb-[210px]"}`}>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
