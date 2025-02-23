import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddToCartPayload, CartResponse } from "../types/cart.types";
import { cartApi } from "../API/cartApi";

export const CART_QUERY_KEY = ["cart"];

export function useCart() {
  const queryClient = useQueryClient();

  const { data, isLoading: isCartLoading } = useQuery<CartResponse>({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
  });

  const cart = data?.data;
  const itemCount = cart?.items.length

  const addToCartMutation = useMutation<CartResponse, Error, AddToCartPayload>({
    mutationFn: (payload) =>
      cartApi.addToCart(payload.productId, payload.quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (err) => {
      console.log("Error adding item:", err)
    }
  });

  const removeFromCartMutation = useMutation<CartResponse, Error, string>({
    mutationFn: (productId) => cartApi.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (err) => {
      console.log("Error removing item:", err.message)
    }
  });

  const clearAllFromCartMutation = useMutation<CartResponse, Error, string>({
    mutationFn: () => cartApi.clearAllFromCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (err) => {
      console.log("Error removing all item:", err.message)
    }
  });

  return {
    cart,
    isCartLoading,
    itemCount,
    addToCardError : addToCartMutation.error?.message,
    removeToCartError: removeFromCartMutation.error?.message,
    clearAllCartError :clearAllFromCartMutation.error?.message,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearAllFromCart: clearAllFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearAllFromCartMutation.isPending,
  };
}
