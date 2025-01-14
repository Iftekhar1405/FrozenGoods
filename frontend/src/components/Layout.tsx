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
    <Box minH="100vh">
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
        {/* Main content with dynamic margin */}
        <Box
          w="full"
          className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'
            }`}
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