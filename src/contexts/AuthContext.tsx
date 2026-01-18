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
  // โหลดครั้งแรก เช็คว่ามี Token ในเครื่องไหม
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // เช็คว่าหมดอายุยัง? (ถ้า exp เป็นวินาที * 1000 เป็น ms)
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            username: decoded.username,
            id: decoded.id,
            exp: decoded.exp,
          });
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
    const decoded: any = jwtDecode(token);
    setUser({ username: decoded.username, id: decoded.id, exp: decoded.exp }); // อัปเดต State ทันที
  };
  // ฟังก์ชั่น Logout
  const logout = () => {
    authService.logout(); // เคลียร์ localStorage
    setUser(null); // เคลียร์ State
    navigate("/login"); // ดีดไปหน้า Login
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
