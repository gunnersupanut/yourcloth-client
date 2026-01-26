// Interface สำหรับหน้า List (ดูคร่าวๆ)
export interface AdminOrder {
    id: number;
    userId: number;
    status: string;
    orderedAt: string;
    paymentMethod: string;
    shippingMethod: string;
    totalPrice: number;
    shippingCost: number;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    items: any[];
}

// Interface สำหรับหน้า Detail (ดูเจาะลึก)
// Extend มาจากตัวบน แล้วเพิ่ม field พิเศษ
export interface AdminOrderDetail extends AdminOrder {
    rejectionReason?: string | null;
    parcelDetail?: any;
    problemDetail?: any;
    totalAmount: number; // ยอดสุทธิ
    itemCount: number;
    receiver: { // Backend ส่ง receiver มา (หน้า List ส่ง customer) เช็คดีๆ หรือ map ให้ตรงกัน
        name: string;
        phone: string;
        address: string;
    }
}

export interface AdminOrderResponse {
    success: boolean;
    data: {
        orders: AdminOrder[];
        total: number;
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
    };
}
