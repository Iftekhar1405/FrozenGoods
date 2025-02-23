import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { ProtectedRoute } from "./ProtectedRoutes";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const isDesktop = useBreakpointValue({ base: false, md: true }) ?? false;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate()


  const isCartRoute = currentPath === '/cart';
  const isAuthRoute = currentPath === '/auth'
  
  // Set initial sidebar state based on screen size
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  // Update currentPath when location changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path)
    if (!isDesktop) {
      setIsSidebarOpen(false); // Close sidebar after navigation only on mobile
    }
  };

  return (
    <Box  minH="100vh" overflow="hidden">
    {!isAuthRoute && (
        <ProtectedRoute>
        <Navbar
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          isOpen={isSidebarOpen}
        />
      </ProtectedRoute>
    )}
      <Flex w={'full'}  position="relative" top="20">
       {!isAuthRoute && (
         <ProtectedRoute>
         <Sidebar
           isOpen={isSidebarOpen}
           onClose={() => setIsSidebarOpen(false)}
           currentPath={currentPath}
           onNavigate={handleNavigate}
         />
       </ProtectedRoute>
       )}
        {/* Main content with dynamic margin and overflow handling */}
        <Box
          w="full"
          className={` transition-all duration-300 ease-in-out overflow-x-hidden ${
            isSidebarOpen ? 'md:ml-64' : 'ml-0'
          }`}
          pb="16"
        >
          {/* Only render SearchBar if not on cart route */}
          {!isCartRoute || isAuthRoute && (
            <ProtectedRoute>
              <SearchBar />
            </ProtectedRoute>
          )}
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;