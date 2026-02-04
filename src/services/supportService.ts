import type { ICreateTicketPayload, ISupportTicket } from "../types/supportTypes";
import { api } from "./api";


// --- Service ---
export const supportService = {

    createTicket: async (data: ICreateTicketPayload) => {
        // ยิงไปที่ /supports (ไม่ต้องใส่ Base URL เพราะ api instance จัดการให้)
        const response = await api.post<{ success: boolean; data: ISupportTicket }>(
            "/supports",
            data
        );
        return response.data.data;
    },

  
    getAllTickets: async () => {
        const response = await api.get<{ success: boolean; data: ISupportTicket[] }>(
            "/supports"
        );
        return response.data.data;
    },


    resolveTicket: async (id: number, adminResponse: string = "") => {
        const response = await api.put<{ success: boolean; data: ISupportTicket }>(
            `/supports/${id}/resolve`,
            { adminResponse }
        );
        return response.data.data;
    }
};