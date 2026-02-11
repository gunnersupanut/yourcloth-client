import { 
  Shirt, 
  Ruler, 
  Footprints, 
  Crown, 
  ShoppingBag 
} from "lucide-react";

// เปลี่ยน type เป็น any หรือระบุ structure ให้ชัดเจน
export const SIZE_DATA: Record<string, any> = {
    "t-shirts": {
        title: "Size Chart for T-Shirt",
        headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
        rows: [
            ["S", "36", "26", "16"],
            ["M", "38", "27", "17"],
            ["L", "40", "28", "18"],
            ["XL", "42", "29", "19"],
            ["XXL", "44", "30", "20"],
        ],
        icon: Shirt 
    },
    // กางเกง -> ใช้ไม้บรรทัด (วัดเอว/ขา)
    "trousers": {
        title: "Size Chart for Bottoms",
        headers: ["Size", "Waist (in)", "Hips (in)", "Length (in)"],
        rows: [
            ["S", "28-30", "38", "38"],
            ["M", "30-32", "40", "39"],
            ["L", "32-34", "42", "40"],
            ["XL", "34-36", "44", "41"],
        ],
        icon: Ruler // 🔥
    },
    // รองเท้า -> รอยเท้า
    "footwear": {
        title: "Size Chart for Footwear",
        headers: ["EU", "US (Men)", "UK", "CM"],
        rows: [
            ["39", "6.5", "5.5", "24.5"],
            ["40", "7", "6", "25"],
            ["41", "8", "7", "26"],
            ["42", "8.5", "7.5", "26.5"],
            ["43", "9.5", "8.5", "27.5"],
        ],
        icon: Footprints // 🔥
    },
    // หมวก -> มงกุฎ (ใส่หัว)
    "headwear": {
        title: "Size Chart for Headwear",
        headers: ["Size", "Head Circumference (cm)"],
        rows: [
            ["S/M", "54-57"],
            ["L/XL", "58-61"],
            ["One Size", "Adjustable (56-60)"],
        ],
        icon: Crown // 🔥
    },
    // กระเป๋า -> ถุงช้อปปิ้ง
    "accessories": {
        title: "Size Chart for Bags (กระเป๋า)",
        headers: ["Type/Size", "Width (in)", "Height (in)", "Depth (in)"],
        rows: [
            ["Small / Crossbody", "8 - 10", "6 - 7", "2 - 3"],
            ["Medium / Tote", "12 - 14", "10 - 12", "4 - 5"],
            ["Large / Backpack", "11 - 13", "16 - 18", "5 - 7"],
            ["Oversized / Duffel", "20 - 22", "10 - 12", "9 - 10"],
        ],
        icon: ShoppingBag // 🔥
    }
};