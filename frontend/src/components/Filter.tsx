import {
    Box,
    Button,
    Checkbox,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Mock API calls - replace with your actual API endpoints
export const fetchBrands = async () => {
    const response = await axios.get('https://frezzers-faves-api.vercel.app/products/brand');
    console.log(response)
    return response.data
};

const fetchCategories = async (selectedBrands: any) => {
    const brandsQuery = selectedBrands.length ? `?brands=${selectedBrands.join(',')}` : '';
    const response = await fetch(`/api/categories${brandsQuery}`);
    return response.json();
};

const FilterModal = ({ isOpen, onClose, title, options, selectedValues, onSelectionChange, isLoading }: any) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = options?.filter((option: any) =>
        option.brandName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", sm: "400px" }}>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {/* Search Input */}
                    <Input
                        placeholder="Search..."
                        mb={4}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Loading Spinner */}
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <Spinner />
                        </Box>
                    ) : (
                        // Filtered Options List
                        <Box
                            display={'grid'}
                            gridTemplateColumns={'repeat(2,1fr)'}
                            gap={5}
                            maxH="400px"
                            overflowY="auto"
                            w="100%"
                        >
                            {filteredOptions.map((option: any) => (
                                <Checkbox
                                    key={option._id}
                                    isChecked={selectedValues.includes(option._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onSelectionChange([...selectedValues, option._id]);
                                        } else {
                                            onSelectionChange(
                                                selectedValues.filter((id: any) => id !== option._id)
                                            );
                                        }
                                    }}
                                >
                                    <Text>{option.brandName}</Text>
                                </Checkbox>
                            ))}
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>

    );
};

const Filters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const brandModal = useDisclosure();
    const categoryModal = useDisclosure();

    // Get selected filters from URL
    const selectedBrands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];

    // Fetch brands
    const { data: brands, isLoading: brandsLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: fetchBrands
    }
    );

    // Fetch categories based on selected brands
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories', selectedBrands],
        queryFn: () => fetchCategories(selectedBrands),
        enabled: true, // Will refetch when selectedBrands changes

    });

    const updateFilters = (type: any, values: any): any => {
        const newParams = new URLSearchParams(searchParams);

        if (values.length) {
            newParams.set(type, values.join(','));
        } else {
            newParams.delete(type);
        }

        // If brands change, reset categories as they might not be valid anymore
        if (type === 'brands') {
            newParams.delete('categories');
        }

        setSearchParams(newParams);
    };

    return (
        <Box
            w="100%"
            maxW="1000px"
            mx="auto"
            p={4}
            display="flex"
            flexDirection={{ base: "column", sm: "row" }}
            alignItems={{ base: "stretch", sm: "center" }}
            justifyContent="space-between"
            gap={4}
        >
            {/* Filter Buttons */}
            <HStack
                spacing={4}
                w={{ base: "100%", sm: "auto" }}
                justifyContent={{ base: "center", sm: "flex-start" }}
            >
                <Button
                    onClick={brandModal.onOpen}
                    colorScheme={selectedBrands.length ? "blue" : "gray"}
                    size="md"
                    w={{ base: "100%", sm: "auto" }}
                >
                    Brands ({selectedBrands.length})
                </Button>

                <Button
                    onClick={categoryModal.onOpen}
                    colorScheme={selectedCategories.length ? "blue" : "gray"}
                    size="md"
                    w={{ base: "100%", sm: "auto" }}
                >
                    Categories ({selectedCategories.length})
                </Button>

                {selectedBrands.length > 0 || selectedCategories.length > 0 ? (
                    <Button
                        variant="outline"
                        onClick={() => setSearchParams({})}
                        w={{ base: "100%", sm: "auto" }}
                    >
                        Clear All
                    </Button>
                ) : null}
            </HStack>

            {/* Brand Modal */}
            <FilterModal
                isOpen={brandModal.isOpen}
                onClose={brandModal.onClose}
                title="Select Brands"
                options={brands}
                selectedValues={selectedBrands}
                onSelectionChange={(values: any) => updateFilters("brands", values)}
                isLoading={brandsLoading}
            />

            {/* Category Modal */}
            <FilterModal
                isOpen={categoryModal.isOpen}
                onClose={categoryModal.onClose}
                title="Select Categories"
                options={categories}
                selectedValues={selectedCategories}
                onSelectionChange={(values: any) => updateFilters("categories", values)}
                isLoading={categoriesLoading}
            />
        </Box>

    );
};

export default Filters;