import {
    Box,
    Flex,
    Image,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const BrandScroll = () => {
    const navigate = useNavigate();

    // Sample brand data - in real usage this would come from props or an API
    const brands = [
        { id: 1, name: 'Nike', image: '/brand-logos/nike.png', url: '/brands/nike' },
        { id: 2, name: 'Adidas', image: '/brand-logos/adidas.png', url: '/brands/adidas' },
        { id: 3, name: 'Puma', image: '/brand-logos/puma.png', url: '/brands/puma' },
        { id: 4, name: 'Reebok', image: '/brand-logos/reebok.png', url: '/brands/reebok' },
        { id: 5, name: 'Under Armour', image: '/brand-logos/under-armour.png', url: '/brands/under-armour' },
        { id: 6, name: 'New Balance', image: '/brand-logos/new-balance.png', url: '/brands/new-balance' },
    ];

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleBrandClick = (url: any) => {
        navigate(url);
    };

    return (
        <Box w="full">
            <Box overflowX="auto" py={4}>
                <Flex minW="full" gap={4} px={4}>
                    {brands.map((brand) => (
                        <VStack
                            key={brand.id}
                            as="button"
                            onClick={() => handleBrandClick(brand.url)}
                            bg={bgColor}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="lg"
                            p={4}
                            minW="150px"
                            shadow="md"
                            _hover={{
                                shadow: 'lg',
                                transform: 'translateY(-2px)',
                            }}
                            transition="all 0.2s"
                        >
                            <Image
                                src={brand.image}
                                alt={`${brand.name} logo`}
                                boxSize="100px"
                                objectFit="contain"
                            />
                            <Text fontSize="sm" fontWeight="medium">
                                {brand.name}
                            </Text>
                        </VStack>
                    ))}
                </Flex>
            </Box>
        </Box>
    );
};

export default BrandScroll;