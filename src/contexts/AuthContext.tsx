import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import type { DecodedToken } from "../types/authTypes";

interface AuthContextType {
  user: DecodedToken | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
// สร้าง context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // elper function สำหรับ Decode และ Set User
  const handleUserSet = (token: string) => {
    const decoded: any = jwtDecode(token);

    // เช็ค Role ตรงนี้ได้เลย ถ้า Token ไม่มี role ให้ default เป็น CUSTOMER
    const userRole = decoded.role || "CUSTOMER";

    setUser({
      username: decoded.username,
      id: decoded.id,
      role: userRole,
      name: decoded.name,
      exp: decoded.exp,
    });
  };
  // โหลดครั้งแรก เช็คว่ามี Token ในเครื่องไหม
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // เช็คว่าหมดอายุยัง? (ถ้า exp เป็นวินาที * 1000 เป็น ms)
        if (decoded.exp * 1000 > Date.now()) {
          handleUserSet(token);
        } else {
          localStorage.removeItem("token"); // หมดอายุก็ลบทิ้ง
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);
  // ฟังก์ชั่น Login
  const login = (token: string) => {
    localStorage.setItem("token", token); // เก็บลงเครื่อง
    handleUserSet(token);
    // เช็ค Role แล้วดีดไปหน้าบ้านที่ถูกต้อง
    const decoded: any = jwtDecode(token);
    if (decoded.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };
  // ฟังก์ชั่น Logout
  const logout = () => {
    // เช็คว่าเป็นใคร
    const currentRole = user?.role;
    authService.logout(); // เคลียร์ localStorage
    setUser(null); // เคลียร์ State
    // ถ้าเป็น Admin ให้กลับไปหน้า Login Admin
    if (currentRole === "ADMIN") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  };
  return (
    <AuthContext.Provider
      value={{ isLoading, user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook สำหรับเรียกใช้
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
