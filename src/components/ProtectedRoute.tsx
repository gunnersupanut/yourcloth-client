import { useEffect, useRef, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  //เอาไว้ไม่ให้เด้งซ้ำ 2
  const toastRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated && !toastRef.current) {
      toast.error("Please log in to continue."), { id: "auth-toast" };
    }
    toastRef.current = true;
  }, [isAuthenticated]);
  if (!isAuthenticated) {
    // ไม่มีบัตรผ่าน? ดีดกลับไปหน้าแรก /
    // replace คือการเขียนทับ history ไม่ให้กด Back กลับมาหน้านี้ได้อีก
    return <Navigate to="/" replace />;
  }

  // มีบัตรผ่าน
  return children;
};
