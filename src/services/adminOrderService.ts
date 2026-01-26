import { api } from "./api";

// Interface สำหรับรับของ 
export interface AdminOrder {
    id: number;
    userId: number;
    status: string;
    orderedAt: string;
    paymentMethod: string;
    shippingMethod: string;
    totalPrice: number;
    shippingCost: number;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    items: any[];
}

export interface AdminOrderResponse {
    success: boolean;
    data: {
        orders: AdminOrder[];
        total: number;
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
    };
}

// Service Object
export const adminOrderService = {
    getOrders: async (
        page: number = 1,
        limit: number = 10,
        status: string = "ALL",
        search: string = "",
        sortBy: string = 'newest',
        startDate: string = '',
        endDate: string = ''
    ) => {
        const response = await api.get<AdminOrderResponse>("/admin/orders/admin", {
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
};