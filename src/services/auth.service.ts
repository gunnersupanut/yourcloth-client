import { api } from './api';
import type { LoginRes, LoginReq } from '../types/user';

export const authService = {
  login: async (userData: LoginReq): Promise<LoginRes> => {
    try {
      const response = await api.post('/auth/login', userData);
      // set token ลง localstorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data
    } catch (error) {
      console.error("Error fetching login:", error);
      throw error;
    }
  },
  logout() { localStorage.removeItem("token") }
}