export interface CheckoutItem {
    // ข้อมูลจาก Server (Product Service)
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    size: string;
    color: string;
    variantId: number
    // ข้อมูลจาก Frontend (Cart) ที่เรา Merge เข้าไป
    quantity: number;
    lineTotal?: number;
}
export interface CheckoutUIState {
    isAddressModalOpen: boolean;
    shippingMethod: "standard" | "express";
    paymentMethod: "bank" | "cod";
    selectedAddressId: number | null;
}