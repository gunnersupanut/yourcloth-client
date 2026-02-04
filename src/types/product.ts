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
  stock: number;      
  price: number; 
}

// Interface เดิม เพิ่ม field นี้เข้าไป
export interface ProductDetail extends Product {
  variants: ProductVariant[];
}

export interface ProductAPIResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}
export interface ProductParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  gender?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

// กำหนด Type ของ Params ที่จะส่งไป Filter (ต้องตรงกับ Service)
export interface ProductParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  gender?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

// กำหนด Type ของ Pagination ที่ Backend ส่งกลับมา
export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
}