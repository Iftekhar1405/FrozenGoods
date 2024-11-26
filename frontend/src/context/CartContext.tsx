import React, { createContext, useContext, useEffect, useReducer } from "react";
import { CartItem } from "../types/types";

interface CartState {
  items: CartItem[];
}

interface CartContextType {
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: any) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) => item.product._id === action.payload.product._id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === action.payload.product._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product._id !== action.payload
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "SET_CART", payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
