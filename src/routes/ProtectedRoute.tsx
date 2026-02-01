import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom"; // เพิ่ม useLocation
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import PageLoading from "../components/ui/PageLoading";

//  สร้าง Interface รับ Props
interface ProtectedRouteProps {
  allowedRoles?: string[]; // ส่งเป็น Array ได้เลย เช่น ['ADMIN', 'SUPER_ADMIN']
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const toastRef = useRef(false);

  // ---เช็ค Toast เหมือนเดิม
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !toastRef.current) {
      // เช็คหน่อยว่าพยายามจะเข้าหน้า Admin ไหม ถ้าใช่ให้เงียบไว้ หรือแจ้งเตือนตามบริบท
      toast.error("Please log in to access this area.", { id: "auth-toast" });
      toastRef.current = true;
    }
  }, [isAuthenticated, isLoading]);

  // ---โหลด
  if (isLoading) {
    return <PageLoading />;
  }

  // --ยังไม่ Login เลย
  if (!isAuthenticated || !user) {
    // เช็คว่าพยายามเข้าหน้า Admin หรือเปล่า?
    // ถ้า URL มีคำว่า admin ให้ดีดไปหน้า login admin
    if (location.pathname.includes("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    // ถ้า user ทั่วไป ดีดไปหน้า login ปกติ
    return <Navigate to="/login" replace />;
  }

  //  ---Login แล้ว แต่ Role ผิด
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // ถ้าเป็น Customer ซ่าอยากเข้าหน้า Admin -> ดีดกลับบ้านไป!
    if (user.role === "CUSTOMER") {
      toast.error("Access Denied: Admins only!");
      return <Navigate to="/" replace />;
    }
  }

  // ผ่านทุกด่าน
  return <Outlet />;
};
