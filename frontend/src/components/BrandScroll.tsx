import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Grid,
    Image,
    Skeleton,
    SkeletonText,
    Spinner,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBrands } from './Filter';

const MotionBox: any = motion(Box);
const MotionDivider = motion(Divider);
const MotionGrid = motion(Grid);

const CategorySkeleton = () => (
    <Box
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        boxShadow="sm"
        bg="white"
        p={3}
        width="100%"
    >
        <Skeleton height="130px" borderRadius="sm" mb={2} />
        <SkeletonText mt="2" noOfLines={1} spacing="4" />
    </Box>
);

const DecorativeDivider = ({ isTop = true }) => (
    <Flex align="center" my={4}>
        <MotionDivider
            borderColor="slate.400"
            borderWidth="2px"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, delay: 0.6 }}
        />
        <Box
            bg="black"
            w={3}
            h={3}
            borderRadius="full"
            mx={2}
            transform={isTop ? "translateY(1px)" : "translateY(-1px)"}
        />
        <MotionDivider
            borderColor="slate.400"
            borderWidth="2px"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, delay: 0.6 }}
        />
    </Flex>
);

const BrandScroll = () => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, margin: "-100px" });

    const { data: brands, isLoading: brandsLoading, isError }: any = useQuery({
        queryKey: ['brands'],
        queryFn: fetchBrands,

    });

    // console.log(brands)

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

    const handleCategoryClick = (brand: any) => {
        navigate(`/brand=${brand}`);
    };

    const handleSeeMore = () => {
        setShowAll(true);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    const displayCategories = showAll ? brands : brands.slice(0, 4);


    return (
        <MotionBox
            ref={containerRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            mt={1}
            boxShadow="lg"
            p={3}
            borderRadius="md"
            bg="gray.50"
        >
            <DecorativeDivider isTop={true} />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        marginBottom: "1rem",
                        color: "#2D3748"
                    }}
                >
                    Explore Your Brands:
                </motion.h3>
            </motion.div>

            <MotionGrid
                templateColumns={{
                    base: "1fr",       // Mobile: 1 column
                    sm: "repeat(2, 1fr)", // Small screens (≥480px): 2 columns
                    md: "repeat(3, 1fr)", // Tablets (≥768px): 3 columns
                    lg: "repeat(4, 1fr)"  // Laptops and larger screens (≥1024px): 4 columns
                }}
                gap={3}
                px={{
                    base: 2,   // Mobile: smaller padding
                    sm: 4,     // Small screens and above: moderate padding
                    md: 6,     // Tablets: more padding
                    lg: 8      // Laptops: extra padding
                }}
                py={4} // Consistent vertical padding
                variants={containerVariants}
            >

                {brandsLoading
                    ? [...Array(2)].map((_, index) => (
                        <CategorySkeleton key={`skeleton-${index}`} />
                    ))
                    : displayCategories.map((brand: any, index: any) => (
                        <MotionBox
                            key={index}
                            variants={itemVariants}
                            borderWidth="1px"
                            borderRadius="md"
                            overflow="hidden"
                            boxShadow="sm"
                            bg="white"
                            p={3}
                            textAlign="center"
                            cursor="pointer"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "xl",
                                transition: { duration: 0.2 },
                            }}
                            onClick={() => handleCategoryClick(brand.brandName)}
                        >
                            <Image
                                src={brand.img}
                                alt={brand.brandName}
                                h="130px"
                                w="100%"
                                objectFit="contain"
                                mb={2}
                                borderRadius="sm"
                            />
                            <Text
                                fontWeight="bold"
                                bgGradient="linear(to-r, red.500, red.300)"
                                bgClip="text"
                            >
                                {brand.brandName}
                            </Text>
                        </MotionBox>
                    ))}
            </MotionGrid>

            {!showAll && !brandsLoading && brands.length > 2 && (
                <Flex justifyContent="center" mt={6}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            colorScheme="red"
                            onClick={handleSeeMore}
                            size="md"
                            px={8}
                            shadow="md"
                            _hover={{
                                transform: "translateY(-2px)",
                                shadow: "lg",
                            }}
                        >
                            See More
                        </Button>
                    </motion.div>
                </Flex>
            )}

            <DecorativeDivider isTop={false} />
        </MotionBox>

    );
};

export default BrandScroll;
