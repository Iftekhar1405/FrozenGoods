import { Box, Heading } from "@chakra-ui/react";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../API/urls";
import ProductList from "../components/ProductList";
import { Product } from "../types/types";

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // const API_URL:string = "https://frezzers-faves-api.vercel.app"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}products/category`);
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
          <Loader2 />
        </Box>
      ) : (
        <ProductList initialProducts={products} />
      )}
    </Box>
  );
};

export default CategoryPage;
