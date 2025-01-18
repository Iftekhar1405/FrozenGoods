import { Box } from "@chakra-ui/react";
import React from "react";
import { getQuery } from "../API/Api";
import { URIS } from "../API/urls";
import ProductList from "../components/ProductList";
import BrandScroll from "../components/BrandScroll";

const HomePage: React.FC = () => {
  const { data } = getQuery(URIS.PRODUCTS);

  return (
    <Box>
      <>
        <BrandScroll />
        {/* Pass initialProducts instead of products */}
        <ProductList initialProducts={data?.products || []} />
      </>
    </Box>
  );
};

export default HomePage;
