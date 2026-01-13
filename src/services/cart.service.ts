import type { AddToCartResponse } from "../types/cartTypes";
import { api } from "./api";

export const cartService = {
    // เพิ่มของลงตะกร้า
    addToCart: async (variantId: number, quantity: number) => {
        const response = await api.post<AddToCartResponse>('/carts', {
            product_variant_id: variantId,
            quantity,
        });
        return response.data;
    },

    // ดึงข้อมูลตะกร้า
    getCartCount: async () => {
        // รอทำ
    },
};