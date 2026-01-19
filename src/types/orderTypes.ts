// DTO (Data Transfer Object) สำหรับรับของจากหน้าบ้าน
export interface CreateOrderItem {
  variantId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  addressId: number;            // ID ที่อยู่ (ต้องมี)
  items: CreateOrderItem[];     // รายการสินค้าที่จะซื้อ (ต้องมี)
  
  // ตัวใหม่ที่เราเพิ่งเพิ่ม
  cartItemIds?: number[];       // Optional 
  paymentMethod: string;        // "BANK_TRANSFER" | "COD" (ตอนนี้รับ string ไปก่อน)
  shippingMethod: string;       // "STANDARD" | "EMS"
}