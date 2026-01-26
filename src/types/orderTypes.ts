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
  shippingCost: number;
}

// ของ 1 ชิ้น
export interface OrderHistoryItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
  description: string;
  net_total: number;
}
export interface OrderReceiver {
  name: string;
  phone: string;
  address: string;
}
// ออเดอร์ 1 ใบ (ประกอบด้วยหลายชิ้น)
export interface OrderHistoryEntry {
  orderId: number;
  status: string;
  rejectionReason?: string
  parcelDetail?: {
    shipping_carrier: string;
    parcel_number: string;
  }
  problemDetail?: {
    description: string;
    attachments: ProblemAttachment[];
    reportedAt: string;
  };
  orderedAt: Date; // หรือ string แล้วแต่ Database return
  totalAmount: number;
  shippingCost: number
  receiver: OrderReceiver; //  (1 ออเดอร์ มี 1 ที่อยู่)
  items: OrderHistoryItem[];
}
interface ProblemAttachment {
  file_url: string;
  media_type: 'Image' | 'Video';
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  totalAmount: number;
  onSuccess: () => void;
}

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    photos: File[];
    video: File | null;
  }) => void;
  isLoading: boolean;
}

export interface ConfirmPaymentPayload {
  imageObj: {
    imageUrl: string;
    filePath: string;
  }
}