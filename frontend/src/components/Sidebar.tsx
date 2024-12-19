import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Hide,
  IconButton,
  Link,
  Show,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Menu } from "lucide-react";
import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const categories = [
  "Frozen Meals",
  "Ice Cream",
  "Vegetables",
  "Pizza",
  "Seafood",
  "Meat",
];

const SidebarContent = () => {
  const location = useLocation();

  return (
    <VStack spacing={4} align="stretch">
      <Link
        as={RouterLink}
        to="/"
        p={2}
        borderRadius="md"
        bg={location.pathname === "/" ? "blue.100" : "transparent"}
        _hover={{ bg: "blue.100" }}
      >
        <Text fontWeight="bold">Home</Text>
      </Link>

      <Text fontWeight="bold" fontSize="lg" mt={4}>
        Categories
      </Text>

      {categories.map((category) => (
        <Link
          key={category}
          as={RouterLink}
          to={`/category/${category.toLowerCase()}`}
          p={2}
          borderRadius="md"
          bg={
            location.pathname === `/category/${category.toLowerCase()}`
              ? "blue.100"
              : "transparent"
          }
          _hover={{ bg: "blue.100" }}
        >
          <Text>{category}</Text>
        </Link>
      ))}

      <Link
        as={RouterLink}
        to="/cart"
        p={2}
        borderRadius="md"
        bg={location.pathname === "/cart" ? "blue.100" : "transparent"}
        _hover={{ bg: "blue.100" }}
        mt={8}
      >
        <Text fontWeight="bold">Shopping Cart</Text>
      </Link>

      <Link
        as={RouterLink}
        to="/scan"
        p={2}
        borderRadius="md"
        bg={location.pathname === "/scan" ? "blue.100" : "transparent"}
        _hover={{ bg: "blue.100" }}
      >
        <Text fontWeight="bold">Scan QR Code</Text>
      </Link>
    </VStack>
  );
};

const Sidebar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Hamburger menu button - only visible on mobile */}
      <Show below="md">
        <IconButton
          icon={<Menu />}
          aria-label="Open Menu"
          onClick={onOpen}
          position="fixed"
          top={4}
          left={4}
          zIndex={20}
        />
      </Show>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody bg="blue.50">
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <Hide below="md">
        <Box
          w={{ base: "200px", lg: "250px" }}
          h="100vh"
          bg="blue.50"
          p={4}
          position="sticky"
          top={0}
          overflowY="auto"
        >
          <SidebarContent />
        </Box>
      </Hide>
    </>
  );
};

export default Sidebar;