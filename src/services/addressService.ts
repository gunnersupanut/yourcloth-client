import type { CreateAddressPayload, UpdateAddressPayload } from "../types/addressTypes";
import { api } from "./api";

export const addressService = {
    getMyAddresses: async () => {
        const response = await api.get("/addresses/");
        return response.data; // เจาะเอา array ออกมา
    },

    createAddress: async (data: CreateAddressPayload) => {
        const response = await api.post("/addresses/", data);
        return response.data;
    },
    updateAddress: async (addressId: number, data: UpdateAddressPayload) => {
        const response = await api.put(`/addresses/${addressId}`, data);
        return response.data;
    },
    deleteAddress: async (addressId: number,) => {
        const response = await api.delete(`/addresses/${addressId}`);
        return response.data;
    },
    setDefault: async (addressId: number,) => {
        const response = await api.patch(`/addresses/default/${addressId}`);
        return response.data;
    },
};