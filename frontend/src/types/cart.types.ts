import { CartItem } from "./types";

export interface User {
    _id: string;
    name: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CartData {
    _id: string;
    userId: User;
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
    createdAt: string;
    updatedAt: string;
}

export interface CartResponse {
    success: boolean;
    message: string;
    data: CartData;
}


export interface AddToCartPayload {
    productId: string;
    quantity: number;
  }