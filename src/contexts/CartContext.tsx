import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/cart.service";
import type { CartItem } from "../types/cartTypes";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number; // เอาไว้โชว์เลขที่ Navbar
  isLoading: boolean;
  fetchCart: () => Promise<void>; // สั่งให้ดึงข้อมูลใหม่ (เช่น ตอน Login เสร็จ หรือตอน Add ของ)
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // ดึง User จาก AuthContext
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูลตะกร้า
  const fetchCart = async () => {
    if (!user) {
      setCartItems([]); // ถ้าไม่มี User ตะกร้าต้องว่าง
      return;
    }

    try {
      setIsLoading(true);
      const res = await cartService.getCartItem();
      setCartItems(res.result);

      console.log("Fetching cart for user:", user.id);
    } catch (error) {
      console.error("Fetch cart error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ดึงข้อมูลทุกครั้งที่ User เปลี่ยน (Login/Logout)
  useEffect(() => {
    fetchCart();
  }, [user]);

  // คำนวณจำนวนชิ้นทั้งหมด (สำหรับ Navbar Badge)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, isLoading, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook สำหรับเรียกใช้
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
