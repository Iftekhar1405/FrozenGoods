import React, { useState } from 'react';
import { Product } from '../types/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@chakra-ui/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => Promise<void>;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleQuantityChange = (value: string) => {
    // Allow empty input
    if (value === '') {
      setQuantity(0);
      return;
    }

    // Convert to float and validate
    const newQuantity = parseFloat(value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      // Round to 2 decimal places
      setQuantity(Math.round(newQuantity * 100) / 100);
    }
  };

  const handleAddToCart = async () => {
    // Prevent adding to cart if quantity is 0
    if (quantity === 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        status: "error",
        position: "bottom-right",
        duration: 2000,
        variant: "subtle"
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAddToCart(product._id, quantity);
      toast({
        title: "Added to Bag",
        status: "success",
        position: "bottom-right",
        duration: 2000,
        variant: "subtle"
      });
      setQuantity(1); // Reset quantity after successful add
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to bag. Please try again.",
        isClosable: true,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-beigeShade2 rounded-lg overflow-hidden
                    transform transition-all duration-300 hover:-translate-y-1
                    hover:shadow-[0_3px_10px_rgb(0,0,0,0.08)]
                    animate-fade-in-up">
      <div className="relative h-32 overflow-hidden">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-sm font-medium text-fontColor font-serifText line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-fontColor">
          Rs.{product.price}
        </p>

        <div className="flex items-center gap-1 pt-1">
          <input
            type="number"
            min="0"
            max="999"
            step="0.01"  // Allow decimals with 2 decimal places
            placeholder="1"
            value={quantity || ''}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-14 h-7 px-1 text-sm border border-beigeShade2 rounded 
                     focus:ring-1 focus:ring-fontColor focus:outline-none"
          />
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading || quantity === 0}
            className={`
              flex-1 h-7 px-2 rounded text-xs font-medium
              flex items-center justify-center
              transform transition-all duration-200
              ${product.inStock && quantity > 0
                ? 'bg-fontColor hover:bg-opacity-90 active:scale-95 text-white'
                : 'bg-beigeShade1 text-gray-400 cursor-not-allowed'}
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Adding...</span>
              </div>
            ) : (
              'Add to Bag'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};