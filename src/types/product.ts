export interface Product {
  id: number;
  product_name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
  gender: string;
  available_colors: {
    name: string;
    code: string;
  }[];
  available_sizes: string[];
}
export interface ProductVariant {
  variant_id: number;
  color_code: string;
  color_name: string;
  size: string;
  stock: number;      // เอาไว้เช็คว่าของหมดไหม
  price: number; // เผื่อไซส์ XXL แพงกว่าปกติ
}

// Interface เดิม เพิ่ม field นี้เข้าไป
export interface ProductDetail extends Product {
  variants: ProductVariant[];
}