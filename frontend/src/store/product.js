import {create} from 'zustand'

export const useProductStore = create((set) => ({
    product: [],
    setProduct: (products) => set({products}),
    createProduct: async (newPrduct) => {
        if(!newPrduct.name || !newPrduct.price || !newPrduct.image){
            return { success:false, message:"Please fill the all field"};
        }

        const res = await fetch("/api/products",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(newPrduct),
        })
        const data =await res.json();
        console.log(data);
        set((state) => ({product: [ ...state.product, data.data]}))
        return {success:true, message: "Product Create successfully"}
    },

    fetchProducts: async() => {
        const res =await fetch("/api/products");
        const data = await res.json();
        set({ product: data.data});
    },
    deleteProduct: async (pid) => {
        const res = await fetch(`/api/products/delete/${pid}`,{
            method:"DELETE",
        });
        const data = await res.json();
        console.log(data);
        if(!data.success){
            return {success:false, message:data.message}
        }
        set((state) => ({product: state.product.filter((product) => product._id !== pid)}));
        return {success:true, message:data.message}
    }
}));