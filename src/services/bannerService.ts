// 👇 Import ตัว api ที่นายสร้างไว้ (เช็ค Path ดีๆ นะว่าอยู่ไหน)
import { api } from "./api";
import type { IBanner, IBannerPayload } from "../types/bannerTypes";

export const bannerService = {
    getPublicBanners: async (): Promise<IBanner[]> => {
        // ไม่ต้องใส่ Base URL แล้ว เพราะ api มันรู้
        const response = await api.get<{ success: boolean; data: IBanner[] }>(
            "/banners/public"
        );
        return response.data.data;
    },
    //  ดึงทั้งหมด (Admin Table)
    getAllBanners: async (): Promise<IBanner[]> => {
        const response = await api.get<{ success: boolean; data: IBanner[] }>(
            "/banners"
        );
        return response.data.data;
    },
    // สร้างใหม่
    createBanner: async (data: IBannerPayload): Promise<IBanner> => {
        const response = await api.post<{ success: boolean; data: IBanner }>(
            "/banners",
            data
        );
        return response.data.data;
    },

    // แก้ไข
    updateBanner: async (id: number, data: Partial<IBannerPayload>): Promise<IBanner> => {
        const response = await api.put<{ success: boolean; data: IBanner }>(
            `/banners/${id}`,
            data
        );
        return response.data.data;
    },

    // ลบ
    deleteBanner: async (id: number): Promise<void> => {
        await api.delete(`/banners/${id}`);
    },
};