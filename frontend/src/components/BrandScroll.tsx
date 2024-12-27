import {
    Box,
    Center,
    Flex,
    Image,
    Spinner,
    Text,
    useColorModeValue,
    VStack
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchBrands } from './Filter';

const BrandScroll = () => {
    const navigate = useNavigate();

    const { data: brands, isLoading: brandsLoading, isError }: any = useQuery({
        queryKey: ['brands'],
        queryFn: fetchBrands,

    });



    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleBrandClick = (url: any) => {
        navigate(url);
    };

    if (brandsLoading) {
        return (
            <Center h="200px">
                <Spinner size="lg" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Center h="200px">
                <Text color="red.500">Failed to load brands</Text>
            </Center>
        );
    }

    if (!brands || brands.length === 0) {
        return (
            <Center h="200px">
                <Text>No brands available</Text>
            </Center>
        );
    }

    return (
        <Box w="full" maxW="100vw" overflowX="hidden">
            <Box overflowX="auto" py={4}>
                <Flex
                    gap={4}
                    px={4}
                    w="max-content"
                    justifyContent="flex-start"
                >
                    {brands.map((brand: any) => (
                        <VStack
                            key={brand._id}
                            as="button"
                            onClick={() => handleBrandClick(brand.url)}
                            bg={bgColor}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="lg"
                            p={4}
                            shadow="md"
                            _hover={{
                                shadow: "lg",
                                transform: "translateY(-2px)",
                            }}
                            transition="all 0.2s"
                        >
                            <Image
                                src={brand.img}
                                alt={`${brand.brandName} logo`}
                                boxSize="100px"
                                objectFit="contain"
                            />
                            <Text fontSize="sm" fontWeight="medium">
                                {brand.brandName}
                            </Text>
                        </VStack>
                    ))}
                </Flex>
            </Box>
        </Box>



    );
};

export default BrandScroll;
