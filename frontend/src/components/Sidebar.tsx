import { Box, Link, Text, VStack } from "@chakra-ui/react";
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

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Box
      w={{ base: "200px", lg: "250px" }}
      h="100vh"
      bg="blue.50"
      p={4}
      position="sticky"
      top={0}
      overflowY="auto"
    >
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
    </Box>
  );
};

export default Sidebar;
