// services/uploadService.ts
import axios from 'axios';

// ใส่ Cloud Name ตรงนี้ (หรือดึงจาก ENV)
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const PRESETS = {
    SLIP: import.meta.env.VITE_CLOUDINARY_PRESET_SLIP,
    PROBLEM: import.meta.env.VITE_CLOUDINARY_PRESET_PROBLEM
};

export const uploadService = {
    upload: async (file: File, orderId: number, type: "SLIP" | "PROBLEM") => {
        // ---เลือก Preset ตาม Type
        const selectedPreset = PRESETS[type];

        if (!selectedPreset) {
            throw new Error(`Preset not found for type: ${type}`);
        }

        // ---กำหนด Folder (แยกกันให้เป็นระเบียบ)
        // - SLIP: เก็บใน slips/order_123
        // - PROBLEM: เก็บใน problems/order_123
        const folderName = type === 'SLIP' ? 'slips' : 'problems';
        const finalFolder = `my-shop/${folderName}/order_${orderId}`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', selectedPreset);
        formData.append('folder', finalFolder);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
                formData
            );
            const rawType = response.data.resource_type;
            // เอาตัวแรกมาทำตัวใหญ่ + ต่อด้วยหางที่เหลือ
            const capitalizedType = rawType.charAt(0).toUpperCase() + rawType.slice(1);
            console.log(`Upload file to cloudinary successfully.`, formData)
            // คืนค่าที่จำเป็นกลับไป
            return {
                file_url: response.data.secure_url,     // เอาไว้โชว์
                file_path: response.data.public_id,     // เอาไว้ลบ
                media_type: capitalizedType as "Image" | "Video" // 'image' หรือ 'video'
            };

        } catch (error) {
            console.error("Upload Failed:", error);
            throw error;
        }
    },

    // ลูปอัปโหลดหลายไฟล์
    uploadMultiple: async (files: File[], orderId: number, type: "SLIP" | "PROBLEM") => {
        // ใช้ Promise.all ยิงพร้อมกันรัวๆ เร็วกว่ารอยิงทีละรูป
        const uploadPromises = files.map(file => uploadService.upload(file, orderId, type));
        return await Promise.all(uploadPromises);
    }
};