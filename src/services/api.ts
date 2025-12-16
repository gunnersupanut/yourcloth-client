import axios from "axios";
import { config } from "../config";

export const api = axios.create({
    baseURL: config.apiUrl,
    // ตั้งเวลา timeout (ถ้าเกิน 10 วิ ให้ตัดจบ กันค้าง)
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
// ดักจับทุก Request ก่อนส่งออกไป
api.interceptors.request.use(
    (config) => {
        // อนาคตจะดึง Token จาก LocalStorage มาแปะตรงนี้
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);