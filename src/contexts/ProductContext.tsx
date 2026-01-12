import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types/product";
import { productService } from "../services/product.service";

// กำหนด type ของ Context
interface ProductContextType {
  products: Product[]; // รายการสินค้าทั้งหมด
  loading: boolean; // กำลังโหลดอยู่ไหม?
  error: string | null; // มี Error อะไรไหม?
  refreshProducts: () => void; // ปุ่มกดโหลดใหม่
}

// สร้าง Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// สร้าง Provider (ตัวครอบที่ส่งข้อมูลไปให้ตัวอื่นๆ)
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // (โหลดข้อมูล)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // เรียกใช้ Service
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
    } finally {
      setLoading(false); // จบงาน (ไม่ว่าจะสำเร็จหรือล้มเหลว) ให้ปิด Loading
    }
  };

  // สั่งให้ทำงานครั้งแรกทันทีที่เข้าเว็บ
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    console.log("all product =", products);
  }, [products]);
  // ส่งออกไปให้ตัวอื่นใช้
  return (
    <ProductContext.Provider
      value={{ products, loading, error, refreshProducts: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// สร้าง Hook  ไว้ให้หน้าอื่นเรียกใช้ง่ายๆ
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct ต้องใช้ภายใต้ <ProductProvider> เท่านั้นนะ!");
  }
  return context;
};
