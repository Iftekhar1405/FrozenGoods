import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { ProtectedRoute } from "./ProtectedRoutes";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const isDesktop = useBreakpointValue({ base: false, md: true }) ?? false;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    if (!isDesktop) {
      setIsSidebarOpen(false); // Close sidebar after navigation only on mobile
    }
  };

  return (
<Box minH="100vh" overflow="hidden">
  <ProtectedRoute>
    <Navbar
      onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      isOpen={isSidebarOpen}
    />
  </ProtectedRoute>
  <Flex position="relative" top="20">
    <ProtectedRoute>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />
    </ProtectedRoute>
    {/* Main content with dynamic margin and overflow handling */}
    {/* // In Layout.tsx */}
<Box
  w="full"
  className={`transition-all duration-300 ease-in-out overflow-x-hidden ${
    isSidebarOpen ? 'md:ml-64' : 'ml-0'
  }`}
  pb="16" // Add padding bottom to account for fixed pagination
>
  <ProtectedRoute>
    <SearchBar />
  </ProtectedRoute>
  {children}
</Box>
  </Flex>
</Box>
  );
};

export default Layout;