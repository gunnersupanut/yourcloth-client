import type { Product } from '../types/product';
import { api } from './api';

export const productService = {
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await api.get('/products');
            return response.data.result;
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
    }
};