import { Box, Flex } from "@chakra-ui/react";
import React, { useState } from "react";

import SearchBar from "./SearchBar";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <Flex minH="100vh" maxW={'100vw'}>
   
      <Box >
      <Navbar 
      onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      isOpen={isSidebarOpen} 
    />
    <Sidebar 
      isOpen={isSidebarOpen} 
      onClose={() => setIsSidebarOpen(false)} 
    />
        <SearchBar />

        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
