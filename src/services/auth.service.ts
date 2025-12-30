import { api } from './api';
import type { LoginRes, LoginReq, RegisterReq, RegisterRes } from '../types/authTypes';

export const authService = {
  login: async (userData: LoginReq): Promise<LoginRes> => {
    // axios ไป api
    try {
      const response = await api.post<LoginRes>('/auth/login', userData);
      // set token ลง localstorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data
    } catch (error) {
      console.error("Error fetching login", " ", error);
      throw error;
    }
  },
  logout() { localStorage.removeItem("token") },
  register: async (userData: RegisterReq): Promise<RegisterRes> => {
    // axios ไป api
    try {
      const response = await api.post<RegisterRes>('/auth/register', userData)
      return response.data
    } catch (error) {
      console.error("Error fetching register", " ", error);
      throw error;
    }
  },
  verifyEmail: async (token: string) => {
    const response = await api.get('/auth/verify-email', { params: { token: token } })
    return response.data;
  },
  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resent-email', {email})
    return response.data
  }
}
