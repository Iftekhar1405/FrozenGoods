import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" p={4}>
        <SearchBar />
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
