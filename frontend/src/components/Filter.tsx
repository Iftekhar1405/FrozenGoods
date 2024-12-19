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
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Mock API calls - replace with your actual API endpoints
const fetchBrands = async () => {
    const response = await fetch('/api/brands');
    return response.json();
};

const fetchCategories = async (selectedBrands: any) => {
    const brandsQuery = selectedBrands.length ? `?brands=${selectedBrands.join(',')}` : '';
    const response = await fetch(`/api/categories${brandsQuery}`);
    return response.json();
};

const FilterModal = ({ isOpen, onClose, title, options, selectedValues, onSelectionChange, isLoading }: any) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredOptions = options?.filter((option: any) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent maxW="400px">
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Input
                        placeholder="Search..."
                        mb={4}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {isLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <Spinner />
                        </Box>
                    ) : (
                        <VStack align="stretch" spacing={2} maxH="400px" overflowY="auto">
                            {filteredOptions.map((option: any) => (
                                <Checkbox
                                    key={option.id}
                                    isChecked={selectedValues.includes(option.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onSelectionChange([...selectedValues, option.id]);
                                        } else {
                                            onSelectionChange(selectedValues.filter((id: any) => id !== option.id));
                                        }
                                    }}
                                >
                                    <Text>{option.name}</Text>
                                </Checkbox>
                            ))}
                        </VStack>
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
        <>
            <HStack spacing={4} p={4} >
                <Button
                    onClick={brandModal.onOpen}
                    colorScheme={selectedBrands.length ? 'blue' : 'gray'}
                    size={'md'}
                >
                    Brands ({selectedBrands.length})
                </Button>

                <Button
                    onClick={categoryModal.onOpen}
                    colorScheme={selectedCategories.length ? 'blue' : 'gray'}
                    size={'md'}
                >
                    Categories ({selectedCategories.length})
                </Button>

                {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchParams({});
                        }}
                    >
                        Clear All
                    </Button>
                )}
            </HStack>

            <FilterModal
                isOpen={brandModal.isOpen}
                onClose={brandModal.onClose}
                title="Select Brands"
                options={brands}
                selectedValues={selectedBrands}
                onSelectionChange={(values: any) => updateFilters('brands', values)}
                isLoading={brandsLoading}
            />

            <FilterModal
                isOpen={categoryModal.isOpen}
                onClose={categoryModal.onClose}
                title="Select Categories"
                options={categories}
                selectedValues={selectedCategories}
                onSelectionChange={(values: any) => updateFilters('categories', values)}
                isLoading={categoriesLoading}
            />
        </>
    );
};

export default Filters;