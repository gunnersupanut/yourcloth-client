import { api } from "./api"; 

export const masterService = {
  getMetadata: async () => {
    try {
      const response = await api.get("/master/metadata"); 
      return response.data;
    } catch (error) {
      console.error("Error fetching master data:", error);
      throw error;
    }
  },

};