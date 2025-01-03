import { Box } from "@chakra-ui/react";
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
        const response = await axios.get("https://frizzers-favess-api.vercel.app/products");
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
      {loading ? (
        <Box textAlign="center" py={10}>
          Loading...
        </Box>
      ) : (
        <>
          <ProductList products={products} />
        </>
      )}
    </Box>
  );
};

export default HomePage;
