import { 
  Shirt, 
  Ruler, 
  Footprints, 
  Crown, 
  ShoppingBag 
} from "lucide-react";

export const SIZE_DATA: Record<string, any> = {
    // เสื้อ (เพิ่มไซส์ใหญ่สะใจ)
    "t-shirts": {
        title: "Size Chart for Tops ",
        headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
        rows: [
            ["S", "36", "26", "16"],
            ["M", "38", "27", "17"],
            ["L", "40", "28", "18"],
            ["XL", "42", "29", "19"],
            ["XXL", "44", "30", "20"],
            ["XXXL", "46", "31", "21"], 
        ],
        icon: Shirt 
    },

    // 👖 กางเกง (ขยายไซส์เอว)
    "trousers": {
        title: "Size Chart for Bottoms ",
        headers: ["Size", "Waist (in)", "Hips (in)", "Length (in)"],
        rows: [
            ["S", "28-30", "38", "38"],
            ["M", "30-32", "40", "39"],
            ["L", "32-34", "42", "40"],
            ["XL", "34-36", "44", "41"],
            ["XXL", "36-38", "46", "42"], 
            ["XXXL", "38-40", "48", "42"],
        ],
        icon: Ruler 
    },

   // 👟 รองเท้า 
    "footwear": {
        title: "Size Chart for Footwear ",
        headers: ["Size", "EU Range", "US (Men)", "Foot Length (cm)"],
        rows: [
            ["S", "38 - 39", "6 - 7", "24.0 - 25.0"],
            ["M", "40 - 41", "7.5 - 8.5", "25.5 - 26.0"],
            ["L", "42 - 43", "9 - 10", "26.5 - 27.5"],
            ["XL", "44 - 45", "10.5 - 11.5", "28.0 - 29.0"],
            ["XXL", "46 - 47", "12 - 13", "29.5 - 30.5"], 
        ],
        icon: Footprints 
    },

    // หมวก (แยกไซส์ละเอียด S-XXL)
    "headwear": {
        title: "Size Chart for Headwear ",
        headers: ["Size", "Head Circumference (cm)", "Hat Size (US)"],
        rows: [
            ["S", "54 - 55", "6 3/4 - 6 7/8"],
            ["M", "56 - 57", "7 - 7 1/8"],
            ["L", "58 - 59", "7 1/4 - 7 3/8"],
            ["XL", "60 - 61", "7 1/2 - 7 5/8"],
            ["XXL", "62 - 63", "7 3/4 - 7 7/8"], 
            ["One Size", "56 - 60 (Adjustable)", "-"],
        ],
        icon: Crown 
    },

    // กระเป๋า (แยก S-XXL ตามความจุ)
    "accessories": {
        title: "Size Chart for Bags (",
        headers: ["Size", "Type Example", "Dimensions (W x H x D)", "Capacity (L)"],
        rows: [
            ["S", "Crossbody / Pouch", "8\" x 6\" x 2\"", "~2 L"],
            ["M", "Standard Backpack", "12\" x 16\" x 5\"", "~15-20 L"],
            ["L", "Laptop Backpack", "13\" x 18\" x 7\"", "~25-30 L"],
            ["XL", "Travel / Duffel", "20\" x 12\" x 10\"", "~40-50 L"],
            ["XXL", "Large Luggage", "28\" x 18\" x 12\"", "~80+ L"], 
        ],
        icon: ShoppingBag 
    }
};