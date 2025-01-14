import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getQuery } from "../API/Api";
import { URIS } from "../API/urls";
import ProductList from "../components/ProductList";
import { Product } from "../types/types";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = getQuery(URIS.PRODUCTS)
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
