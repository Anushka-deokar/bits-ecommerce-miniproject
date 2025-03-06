
import { create } from "zustand";
import axios from "axios";
import { CartItem } from "../types";

const API_URL = "https://dummyjson.com/carts";

interface CartStoreState {
    carts: CartItem[];
    totalPrice: number;
    fetchCarts: () => Promise<void>;
    addToCart: (cartData: CartItem) => Promise<void>;
    removeFromCart: (id: number) => Promise<void>;
}

export const useCartStore = create<CartStoreState>((set) => ({
    carts: [],
    totalPrice: 0,

    fetchCarts: async () => {
        try {
            const response = await axios.get(API_URL);
            const cartsArray: { products: CartItem[] }[] = response.data.carts;

            const formattedCarts: CartItem[] = cartsArray.flatMap((cart: { products: CartItem[] }) =>
                cart.products.map((product: CartItem) => ({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: product.quantity,
                    thumbnail: product.thumbnail,
                }))
            );


            const totalPrice: number = formattedCarts.reduce(
                (acc: number, item: CartItem) => acc + item.price * item.quantity, 0
            );

            set({ carts: formattedCarts, totalPrice });
        } catch (error) {
            console.error("❌ Error fetching carts:", error);
        }
    },

    addToCart: async (cartData) => {
        try {
            const response = await axios.post(`${API_URL}/add`, cartData);
            set((state) => {
                const updatedCarts = [...state.carts, response.data];
                return {
                    carts: updatedCarts,
                    totalPrice: updatedCarts.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                    ),
                };
            });
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
        }
    },

    removeFromCart: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            set((state) => {
                const updatedCarts = state.carts.filter((cart) => cart.id !== id);
                return {
                    carts: updatedCarts,
                    totalPrice: updatedCarts.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                    ),
                };
            });
        } catch (error) {
            console.error("❌ Error removing from cart:", error);
        }
    },
}));
