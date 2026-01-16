export interface CartItem {
    cart_item_id: number;
    product_id: number;
    category: string;
    variant_id: number;
    product_name: string;
    color: string;
    price: string;
    size: string;
    description: string;
    image_url: string;
    quantity: number;
    stock_quantity: number;
}
export interface AddToCartResponse {
    message: string;
    result: CartItem;
}
