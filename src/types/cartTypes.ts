export interface CartItem {
    id: number;
    product_variant_id: number;
    quantity: number;
}
export interface AddToCartResponse {
    message: string;
    result: CartItem;
}
export interface CartContextType {
    totalItems: number;
    addToCart: (variantId: number, quantity: number, productName: string) => Promise<void>;
    isLoading: boolean;
}