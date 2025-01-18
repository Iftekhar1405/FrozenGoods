import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import debounce from "lodash/debounce";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddForm from "../pages/AddForm";
import { Product } from "../types/types";
import Filters from "./Filter";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        searchProducts(query);
      } else {
        setResults([]);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleResultClick = (product: Product) => {
    navigate(`/category/${String(product.category).toLowerCase()}`, {
      state: { highlightProduct: product._id },
    });
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      maxW="1000px"
      mx="auto"
    >
      {/* Search Bar Section */}
      <Box
        flex={{ base: "unset", md: "1" }}
        mx={{ base: 0, md: "auto" }}
        w={{ base: "100%", md: "auto" }}
        position="relative"
      >
        <InputGroup>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowResults(true)}
            bg="white"
          />
          <InputRightElement>
            {loading ? <Spinner size="sm" /> : <SearchIcon />}
          </InputRightElement>
        </InputGroup>

        {showResults && searchTerm && (
          <List
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            mt={2}
            maxH="300px"
            overflowY="auto"
            zIndex={10}
          >
            {results.map((product) => (
              <ListItem
                key={product._id}
                p={3}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleResultClick(product)}
              >
                <Text fontWeight="medium">{product.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {String(product.category)} - ${Number(product.price).toFixed(2)}
                </Text>
              </ListItem>
            ))}
            {results.length === 0 && searchTerm && !loading && (
              <ListItem p={3}>
                <Text color="gray.500">No products found</Text>
              </ListItem>
            )}
          </List>
        )}
      </Box>

      {/* Filters Section */}
      <Box
        flex={{ base: "unset", md: "1" }}
        w={{ base: "100%", md: "auto" }}
        mt={{ base: 4, md: 0 }}
      >
        <Filters />
      </Box>
      <AddForm />
    </Box>
  );
};

export default SearchBar;
