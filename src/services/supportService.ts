import type { ICreateTicketPayload, ISupportTicket } from "../types/supportTypes";
import { api } from "./api";


// --- Service ---
export const supportService = {
    // 📨 1. User: ส่งเรื่องร้องเรียน (POST /supports)
    createTicket: async (data: ICreateTicketPayload) => {
        // ยิงไปที่ /supports (ไม่ต้องใส่ Base URL เพราะ api instance จัดการให้)
        const response = await api.post<{ success: boolean; data: ISupportTicket }>(
            "/supports",
            data
        );
        return response.data.data;
    },

    // 📋 2. Admin: ดึงรายการทั้งหมด (GET /supports)
    getAllTickets: async () => {
        const response = await api.get<{ success: boolean; data: ISupportTicket[] }>(
            "/supports"
        );
        return response.data.data;
    },

    // ✅ 3. Admin: กดจบงาน/ตอบกลับ (PUT /supports/:id/resolve)
    resolveTicket: async (id: number, adminResponse: string = "") => {
        const response = await api.put<{ success: boolean; data: ISupportTicket }>(
            `/supports/${id}/resolve`,
            { adminResponse }
        );
        return response.data.data;
    }
};