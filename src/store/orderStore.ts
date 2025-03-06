

import { create } from "zustand";
import axios from "axios";

interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    userId: number;
    products: CartItem[];
    total: number;
    status: "Pending" | "Shipped" | "Delivered";
}

interface OrderState {
    orders: Order[];
    fetchOrders: () => Promise<void>;
    updateOrderStatus: (orderId: number, status: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    fetchOrders: async () => {
        try {
            const response = await axios.get("https://dummyjson.com/carts");
            set({ orders: response.data.carts }); // Ensure orders are set properly
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    },
    updateOrderStatus: async (orderId, status) => {
        try {
            await axios.put(`https://dummyjson.com/carts/${orderId}`, { status });

            set((state) => ({
                orders: state.orders.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                ),
            }) as Partial<OrderState>);  // ✅ Type assertion to Partial<OrderState>
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    },
}));



