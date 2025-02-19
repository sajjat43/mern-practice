import {create} from 'zustand'
import axios from 'axios'

const getAuthHeaders = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    if (!user || !user.token) return null;
    
    return {
        headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const useProductStore = create((set) => ({
    product: [],
    isLoading: false,
    error: null,

    setProduct: (products) => set({products}),

    createProduct: async (newProduct) => {
        try {
            const res = await axios.post("/api/products", newProduct, getAuthHeaders());
            // console.log(res.data);
            set((state) => ({ 
                product: [...state.product, res.data.data],
                error: null
            }));
            return { success: true, message: "Product created successfully" };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Failed to create product" 
            };
        }
    },

    fetchProducts: async () => {
        set({ isLoading: true });
        const headers = getAuthHeaders();
        
        if (!headers) {
            set({ 
                error: "Please login first",
                isLoading: false 
            });
            return { success: false, message: "Please login first" };
        }

        try {
            const res = await axios.get("/api/products", headers);
            set({ 
                product: res.data.data,
                isLoading: false,
                error: null
            });
            return { success: true };
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Failed to fetch products",
                isLoading: false 
            });
            return { success: false, message: error.response?.data?.message };
        }
    },

    deleteProduct: async (pid) => {
        try {
            const res = await axios.delete(`/api/products/delete/${pid}`, getAuthHeaders());

            if (res.data.success) {
                set((state) => ({
                    product: state.product.filter((product) => product._id !== pid),
                    error: null
                }));
                return { success: true, message: res.data.message };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to delete product" });
            return { success: false, message: error.response?.data?.message };
        }
    },

    updateProduct: async (pid, updatedProduct) => {
        try {
            const res = await axios.put(`/api/products/update/${pid}`, updatedProduct, getAuthHeaders());

            if (res.data.success) {
                set((state) => ({
                    product: state.product.map((product) =>
                        product._id === pid ? res.data.data : product
                    ),
                    error: null
                }));
                return { success: true, message: res.data.message };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            set({ error: error.response?.data?.message || "Failed to update product" });
            return { success: false, message: error.response?.data?.message };
        }
    },

    clearError: () => set({ error: null })
}));