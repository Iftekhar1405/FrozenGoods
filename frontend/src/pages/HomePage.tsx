import { Box, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import { Product } from "../types/types";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3500/products");
        const data = await response.data;
        console.log(data)
        setProducts(data.products);
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
