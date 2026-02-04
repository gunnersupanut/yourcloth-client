import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { PaginationMeta, Product, ProductParams } from "../types/product";
import { productService } from "../services/product.service";

// กำหนด Type ของ Context ใหม่
interface ProductContextType {
  products: Product[];
  pagination: PaginationMeta; // เพิ่มตัวนี้
  loading: boolean;
  error: string | null;
  fetchProducts: (params?: ProductParams) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  // Default Pagination State
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false); // เปลี่ยนเป็น false เริ่มต้น (รอเรียก)
  const [error, setError] = useState<string | null>(null);

  // ฟังก์ชันโหลดของ (ใส่ useCallback เพื่อกัน render loop เวลาใช้ใน useEffect)
  const fetchProducts = useCallback(async (params: ProductParams = {}) => {
    try {
      setLoading(true);
      setError(null);


      const response = await productService.getAllProducts(params);
      // console.log("Product data:", response);
      // Backend ส่งมาแบบนี้: { success: true, data: [...], pagination: {...} }
      // หรือถ้า Service return data.data ก็ปรับตรงนี้ตาม response จริงนายนะ
      setProducts(response.data || response); // กันเหนียว

      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        pagination,
        loading,
        error,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct ต้องใช้ภายใต้ <ProductProvider> เท่านั้นนะ!");
  }
  return context;
};
