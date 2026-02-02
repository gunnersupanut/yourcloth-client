import type { UserResponse } from "../types/adminUserTypes";
import { api } from "./api";




export const adminUserService = {
    // Get List
    getUsers: async (page: number = 1, search: string = "") => {
        // ส่ง params ไป: /admin/users?page=1&search=gunner
        const res = await api.get<UserResponse>(`/admin/users`, {
            params: { page, search, limit: 10 },
        });
        return res.data;
    },

    // Ban/Unban
    toggleStatus: async (id: number, isActive: boolean) => {
        // ส่งค่าที่ต้องการจะเป็นไป (เช่น ถ้าจะแบน ให้ส่ง is_active: false)
        const res = await api.patch(`/admin/users/${id}/status`, {
            is_active: isActive,
        });
        return res.data;
    },
};