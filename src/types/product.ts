export interface Product {
  id: number;
  product_name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
  available_colors_code: string[];
  available_colors_name: string[];
}