import { api } from './api';

export const userService = {
    // ดึงข้อมูลโปรไฟล์
    getProfile: async () => {
        return await api.get("/users/profile");
    },
    // อัปเดตข้อมูล
    updateProfile: async (data: any) => {
        return await api.put("/users/profile", data);
    },
};