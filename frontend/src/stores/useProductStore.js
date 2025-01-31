import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    
    setProducts: (products) => set({ products }),
    
    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post('/product', productData);
            set((prevState) => ({ products: [...prevState.products, res.data], loading: false }));
            toast.success('Product created successfully');
        } catch (error) {
            console.error('Error:', error);
            set({ loading: false });
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    },
}))