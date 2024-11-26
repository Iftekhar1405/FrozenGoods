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
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {products.map((product) => (
        <Box
          key={product._id}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
        >
          <Image
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            height="200px"
            width="100%"
            objectFit="cover"
          />
          <Box p={4}>
            <Text fontWeight="bold" fontSize="lg">
              {product.name}
            </Text>
            <Text>${product.price.toFixed(2)}</Text>
            <Text>In Stock: {product.stockQuantity}</Text>
            <NumberInput
              min={1}
              max={product.stockQuantity}
              value={quantities[product._id] || 1}
              onChange={(value) =>
                setQuantities({ ...quantities, [product._id]: parseInt(value) })
              }
            >
              <NumberInputField />
            </NumberInput>
            <Button
              mt={2}
              colorScheme="blue"
              onClick={() => handleAddToCart(product)}
              isDisabled={product.stockQuantity === 0}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default ProductList;
