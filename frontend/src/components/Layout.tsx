import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import BrandScroll from "./BrandScroll";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Flex minH="100vh" maxW={'100vw'}>
      <Sidebar />
      <Box p={4} >
        <BrandScroll />
        <SearchBar />
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
