import { Box } from "@chakra-ui/react";
import React from "react";
import { getQuery } from "../API/Api";
import { URIS } from "../API/urls";
import ProductList from "../components/ProductList";

const HomePage: React.FC = () => {

  const { data } = getQuery(URIS.PRODUCTS)





  return (
    <Box>

      <>
        <ProductList products={data?.products} />

      </>
    </Box>
  );
};

export default HomePage;
