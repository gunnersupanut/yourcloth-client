import type { AdminOrderDetail, AdminOrderResponse } from "../types/adminOrderTypes";
import { api } from "./api"; // เช็ค path import api ให้ตรงนะ

// Service Object
export const adminOrderService = {
    // ดึงรายการทั้งหมด
    getOrders: async (
        page: number = 1,
        limit: number = 10,
        status: string = "ALL",
        search: string = "",
        sortBy: string = 'newest',
        startDate: string = '',
        endDate: string = ''
    ) => {
        const response = await api.get<AdminOrderResponse>("/admin/orders", {
            params: {
                page,
                limit,
                status,
                search,
                sortBy,
                startDate,
                endDate
            },
        });
        return response.data;
    },

    // ดึงรายละเอียดรายตัว 
    getOrderDetails: async (orderId: number) => {
        // ยิงไปที่ GET /api/v1/admin/orders/:id
        const response = await api.get<{ success: boolean; data: AdminOrderDetail }>(
            `/admin/orders/${orderId}`
        );
        return response.data;
    },

    // อัปเดตสถานะ 
    updateOrderStatus: async (
        orderId: number,
        status: string,
        reason?: string,       // สำหรับ Reject
        parcelNumber?: string, // สำหรับ Shipping 
        shippingCarrier?: string  
    ) => {
        let response;

        switch (status) {
            case 'PACKING':
                // กรณี Approve (เปลี่ยนจาก INSPECTING -> PACKING)
                // Route: POST /:orderId/approve
                response = await api.post(`/admin/orders/${orderId}/approve`);
                break;

            case 'REJECTED':
                // กรณี Reject (เปลี่ยนจาก INSPECTING -> PENDING/REJECTED)
                // Route: POST /:orderId/reject
                // ส่ง reason ไปใน Body
                response = await api.post(`/admin/orders/${orderId}/reject`, {
                    reason: reason
                });
                break;

            case 'SHIPPING':
                // กรณีส่งของ (เปลี่ยนจาก PACKING -> SHIPPING)
                // Route: POST /:orderId/shipping
                // ต้องส่งเลขพัสดุไปด้วย (เดี๋ยวนายต้องไปแก้ Modal ให้กรอกเลขพัสดุก่อนส่งนะ)
                response = await api.post(`/admin/orders/${orderId}/shipping`, {
                    parcelNumber: parcelNumber || "",
                    shippingCarrier: shippingCarrier || "Other"
                });
                break;

            case 'CANCEL':
                // กรณี Cancel (นายยังไม่ได้ให้ Route มา พี่สมมติว่าเป็นแบบนี้นะ)
                // ถ้ายังไม่มี Route นี้ ให้ไปเพิ่มที่ Backend ด้วย!
                response = await api.post(`/admin/orders/${orderId}/cancel`);
                break;

            default:
                // กรณีอื่นๆ (เผื่อมี)
                throw new Error(`Unknown status action: ${status}`);
        }

        return response.data;
    }
};