// Product Type
export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
}

// Cart Item Type
export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

// export interface Order {
//     id: number;
//     userId: number;
//     total: number;
//     status: string;
//     products: {
//         id: number;
//         title: string;
//         price: number;
//         quantity: number;
//     }[];
// }

// User Type
export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

// Auth Type
export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}
