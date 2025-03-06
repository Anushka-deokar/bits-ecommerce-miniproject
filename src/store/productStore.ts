import { create } from 'zustand';
import { Product } from '../types';

interface ProductStoreState {
    products: Product[];
    addProduct: (newProduct: Product) => void;
    updateProduct: (updatedProduct: Product) => void;
    removeProduct: (productId: number) => void;
    setProducts: (products: Product[]) => void;
}


const useProductStore = create<ProductStoreState>((set) => ({
    products: [],

    addProduct: (newProduct) => {
        set((state) => ({
            products: [...state.products, newProduct],
        }));
    },

    updateProduct: (updatedProduct) => {
        set((state) => ({
            products: state.products.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            ),
        }));
    },

    removeProduct: (productId) => {
        set((state) => ({
            products: state.products.filter((product) => product.id !== productId),
        }));
    },

    setProducts: (products) => {
        set(() => ({ products }));
    },
}));

export default useProductStore;
