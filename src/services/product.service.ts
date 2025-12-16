import type { Product } from '../types/product';
import { api } from './api';

// Mock ข้อมูล
// const MOCK_PRODUCTS: Product[] = [
//     { id: 1, name: "Black T-shirt", price: 500, category: "tops", image: "/mockproducts/BlackT-shirt.png", color: ["black", "red"] },
//     { id: 2, name: "White T-shirt", price: 400, category: "tops", image: "/mockproducts/WhiteT-shirt.png", color: ["white", "green"] },
//     { id: 3, name: "Cream T-shirt", price: 300, category: "tops", image: "/mockproducts/CreamT-shirt.png", color: ["red", "pink"] },
//     { id: 4, name: "รองเท้า Canvas", price: 1200, category: "shoes", image: "/mockproducts/shoe-1.jpg", color: ["black", "red"] },
//     // Pants (กางเกง)
//     { id: 5, name: "Blue Jeans Slim Fit", price: 990, category: "pants", image: "/mockproducts/blue-jeans.jpg", color: ["blue", "navy"] },
//     { id: 6, name: "Cargo Pants Khaki", price: 850, category: "pants", image: "/mockproducts/cargo-khaki.jpg", color: ["khaki", "green"] },
//     { id: 7, name: "Black Shorts", price: 450, category: "pants", image: "/mockproducts/black-shorts.png", color: ["black", "grey"] },
//     { id: 8, name: "Jogger Pants", price: 600, category: "pants", image: "/mockproducts/jogger-grey.jpg", color: ["grey", "black"] },
//     { id: 9, name: "Chino Pants", price: 890, category: "pants", image: "/mockproducts/chino-brown.jpg", color: ["brown", "cream"] },

//     // Tops (เสื้อ เพิ่มเติม)
//     { id: 10, name: "Oversized Hoodie", price: 1200, category: "tops", image: "/mockproducts/hoodie-black.jpg", color: ["black", "white"] },
//     { id: 11, name: "Denim Jacket", price: 1500, category: "tops", image: "/mockproducts/denim-jacket.png", color: ["blue"] },
//     { id: 12, name: "Striped Polo Shirt", price: 550, category: "tops", image: "/mockproducts/polo-stripe.jpg", color: ["navy", "red"] },
//     { id: 13, name: "Flannel Shirt", price: 690, category: "tops", image: "/mockproducts/flannel-check.jpg", color: ["red", "green"] },

//     // Headwear (หมวก)
//     { id: 14, name: "Baseball Cap NY", price: 350, category: "headwear", image: "/mockproducts/cap-ny.jpg", color: ["black", "white"] },
//     { id: 15, name: "Bucket Hat", price: 290, category: "headwear", image: "/mockproducts/bucket-hat.png", color: ["cream", "black"] },
//     { id: 16, name: "Beanie Wool", price: 250, category: "headwear", image: "/mockproducts/beanie-grey.jpg", color: ["grey", "brown"] },
//     { id: 17, name: "Snapback Cap", price: 390, category: "headwear", image: "/mockproducts/snapback.jpg", color: ["red", "black"] },

//     // Shoes (รองเท้า เพิ่มเติม)
//     { id: 18, name: "White Sneakers", price: 1500, category: "shoes", image: "/mockproducts/sneaker-white.jpg", color: ["white"] },
//     { id: 19, name: "Leather Boots", price: 2200, category: "shoes", image: "/mockproducts/boots-brown.jpg", color: ["brown", "black"] },
//     { id: 20, name: "Slip-on Sandals", price: 300, category: "shoes", image: "/mockproducts/sandals.png", color: ["black", "green"] },

//     // Accessories (เครื่องประดับ)
//     { id: 21, name: "Leather Belt", price: 450, category: "accessories", image: "/mockproducts/belt-brown.jpg", color: ["brown", "black"] },
//     { id: 22, name: "Crossbody Bag", price: 790, category: "accessories", image: "/mockproducts/bag-crossbody.jpg", color: ["black"] },
//     { id: 23, name: "Sunglasses Retro", price: 300, category: "accessories", image: "/mockproducts/sunglasses.png", color: ["black", "gold"] },
//     { id: 24, name: "Cotton Socks (Pack)", price: 150, category: "accessories", image: "/mockproducts/socks-white.jpg", color: ["white", "black"] }
//     // ... ลองก๊อปเพิ่มให้ครบสัก 10-12 อันนะครับ
// ];

export const productService = {
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await api.get('/products');
            console.log("Fetched products from API:", response.data);
            return response.data.result;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    // เตรียมไว้สำหรับอนาคต
    getById: async (id: number) => {
        // ... logic หาของชิ้นเดียว
        console.log("Get product by id:", id);
    }
};