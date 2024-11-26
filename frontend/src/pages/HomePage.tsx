import { Box, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import { Product } from "../types/types";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box>
      <Heading mb={6}>Featured Products</Heading>
      {loading ? (
        <Box textAlign="center" py={10}>
          Loading...
        </Box>
      ) : (
        <>
          <ProductList products={products} />
          <Text size="2xl">hello working</Text>
        </>
      )}
    </Box>
  );
};

export default HomePage;
