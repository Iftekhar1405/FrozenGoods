import axios from "axios"
import { BASE_URL } from "./urls"
import { CartResponse } from "../types/cart.types"
axios.defaults.withCredentials = true
export const cartApi = {
    getCart: async (): Promise<CartResponse> => {
        const response = await axios.get(`${BASE_URL}cart/get`, {
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })
        
        return response.data
    },

    addToCart: async (productId: string,quantity: number): Promise<CartResponse>=> {
        console.log(quantity);
        const response = await axios.post(`${BASE_URL}cart/add`, 
            {productId, quantity}
        )
        return response.data
    },

    removeFromCart: async (productId:string): Promise<CartResponse>=> {
        const response = await axios.delete(`${BASE_URL}cart/delete/${productId}`)
        return response.data
    }, 

    clearAllFromCart : async ():Promise<CartResponse> => {
        const response = await axios.delete(`${BASE_URL}cart/clearAll`, {
            withCredentials:true
        })
        return response.data
    }

}