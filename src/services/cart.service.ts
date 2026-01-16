import type { AddToCartResponse } from "../types/cartTypes";
import { api } from "./api";

export const cartService = {
    // เพิ่มของลงตะกร้า
    addToCart: async (variantId: number, quantity: number) => {
        try {
            const response = await api.post<AddToCartResponse>('/carts', {
                product_variant_id: variantId,
                quantity,
            });
            return response.data;
        } catch (error) {
            console.error("Error adding cart:", error);
            throw error;
        }

    },

    // ดึงข้อมูลตะกร้า
    getCartItem: async () => {
        try {
            const response = await api.get('/carts')
            return response.data
        } catch (error) {
            console.error("Error fetching cart:", error);
            throw error;
        }
    },
    updateCart: async (cartId: number, quantity: number, variantId: number) => {
        try {
            const res = await api.patch(`/carts/${cartId}`, {
                quantity, variantId
            })
            return res.data
        } catch (error) {
            console.error("Error update cart:", error);
            throw error;
        }
    }
};