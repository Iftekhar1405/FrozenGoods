import {
  Box,
  Button,
  Image,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useCart } from "../context/CartContext";
import { Product } from "../types/types";

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = React.useState<{ [key: string]: number }>(
    {}
  );

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product._id] || 1;
    addToCart({ product, quantity });
    setQuantities({ ...quantities, [product._id]: 1 }); // Reset quantity
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      p={4}
      w="100%"
      bg="gray.50"
    >
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={6}
        maxW="1200px"
        w="100%"
      >
        {products.map((product) => (
          <Box
            key={product._id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            shadow="md"
          >
            {/* Product Image */}
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              height="200px"
              width="100%"
              objectFit="cover"
            />

            {/* Product Details */}
            <Box p={4}>
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                {product.name}
              </Text>
              <Text fontSize="md" color="gray.600" mb={2}>
                ${product?.price}
              </Text>
              <Text fontSize="sm" color="gray.500" mb={2}>
                In Stock: {product.stockQuantity}
              </Text>

              {/* Quantity Selector */}
              <NumberInput
                size="sm"
                min={1}
                max={product.stockQuantity}
                value={quantities[product._id] || 1}
                onChange={(value) =>
                  setQuantities((prev) => ({ ...prev, [product._id]: parseInt(value) }))
                }
                mb={3}
              >
                <NumberInputField />
              </NumberInput>

              {/* Add to Cart Button */}
              <Button
                colorScheme="blue"
                onClick={() => handleAddToCart(product)}
                isDisabled={product.stockQuantity === 0}
                w="100%"
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>

  );
};

export default ProductList;
