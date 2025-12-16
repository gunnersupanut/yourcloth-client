import { Outlet } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";

const MainLayout = () => {
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
      <Footer />
    </div>
  );
};

export default MainLayout;
