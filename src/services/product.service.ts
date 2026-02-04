import type { Product, ProductAPIResponse, ProductParams } from '../types/product';
import { api } from './api';

export const productService = {
    getAllProducts: async (params: ProductParams = {}): Promise<ProductAPIResponse> => {
        try {
            // ส่ง params ไปให้ axios จัดการ query string
            const response = await api.get<ProductAPIResponse>('/products', {
                params: params
            });

            // ส่งข้อมูลกลับไปทั้งก้อน (data + pagination)
            return response.data;

        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    getById: async (id: number | string) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    getAdmin: async (): Promise<Product[]> => {
        try {
            const response = await api.get('/products/admin');
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    getAdminById: async (id: number) => {
        try {
            const response = await api.get(`/products/admin/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product for admin:", error);
            throw error;
        }
    },
    update: async (id: number, data: any) => {
        try {
            const response = await api.put(`/products/admin/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },
    create: async (data: any) => {
        try {
            const response = await api.post('/products/admin/create',
                data
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    validateCheckout: async (variantIds: number[]) => {
        try {
            const response = await api.post(`/products/validate-checkout`, {
                variantIds
            }
            );
            return response.data.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    delete: async (id: number) => {
        try {
            const response = await api.delete(`/products/admin/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }
};