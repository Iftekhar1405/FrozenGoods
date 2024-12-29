import { Box, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import { Product } from "../types/types";

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/category/${category}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <Box>
      <Heading mb={6} textTransform="capitalize">
        {category?.replace("-", " ")}
      </Heading>
      {loading ? (
        <Box textAlign="center" py={10}>
          Loading...
        </Box>
      ) : (
        <ProductList products={products} />
      )}
    </Box>
  );
};

export default CategoryPage;
