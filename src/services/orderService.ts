import type { CreateOrderPayload } from '../types/orderTypes';
import { api } from './api';
export const orderService = {
    createOrder: async (payload: CreateOrderPayload) => {
        try {
            const response = await api.post("/orders/", payload);
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }

    }
}