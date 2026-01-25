import type { ConfirmPaymentPayload, CreateOrderPayload } from '../types/orderTypes';
import { api } from './api';
export const orderService = {
    getAllOrder: async () => {
        try {
            const response = await api.get("/orders/");
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },
    getOrderById: async (orderId: string) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },
    createOrder: async (payload: CreateOrderPayload) => {
        try {
            const response = await api.post("/orders/", payload);
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }

    },
    moveOrdertoInspecting: async (orderId: number, payload: ConfirmPaymentPayload) => {
        try {
            const response = await api.post(`/orders/${orderId}/confirm-payment`, payload);
            return response.data;
        } catch (error) {
            console.error("Error move order to inpecting:", error);
            throw error;
        }
    },
    confirmReceived: async (orderId: number) => {
        try {
            const response = await api.post(`/orders/${orderId}/confirm-received`);
            return response.data;
        } catch (error) {
            console.error("Error move order to inpecting:", error);
            throw error;
        }
    },
    cancelOrder: async (
        orderId: number,
        data: {
            problemDescription: string;
            attachments: { file_url: string; file_path: string; media_type: "Image" | "Video" }[]
        }
    ) => {
        try {
            // ยิง POST พร้อมแนบ Body (data) ไปด้วย
            const response = await api.post(`/orders/${orderId}/cancel`, data);
            return response.data;
        } catch (error) {
            console.error("Error cancelling order:", error);
            throw error;
        }
    },
}