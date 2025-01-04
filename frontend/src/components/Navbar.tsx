import {
    CloseIcon,
    HamburgerIcon,
} from '@chakra-ui/icons';
import {
    Badge,
    Box,
    Button,
    Collapse,
    Container,
    Flex,
    IconButton,
    Image,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { ShoppingCartIcon } from 'lucide-react';
import React from 'react';

const Navbar = () => {
    const { isOpen, onToggle } = useDisclosure();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    return (
        <Box position={'sticky'} top={0} zIndex={100}>
            <Container maxW="8xl" >
                <Flex
                    bg={'rgb(224, 212, 188)'}
                    color={useColorModeValue('gray.600', 'white')}
                    minH={'60px'}
                    h={'24'}
                    py={{ base: 2 }}
                    px={{ base: 4 }}
                    borderBottom={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.900')}
                    align={'center'}
                >
                    {/* Mobile Hamburger Button */}
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}
                    >
                        <IconButton
                            onClick={onToggle}
                            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                            _hover={{ bg: 'blue.50' }}
                        />
                    </Flex>

                    {/* Logo */}
                    <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                        <Flex align="center">
                            <Box
                                bg="blue.500"
                                w="40px"
                                h="40px"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ bg: 'blue.600' }}
                                transition="all 0.2s"
                            >
                                <Image src='./logo.jpg' />
                            </Box>
                            <Text
                                as="span"
                                ml={3}
                                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                                fontFamily={'heading'}
                                color={useColorModeValue('gray.800', 'white')}
                                fontWeight="bold"
                                display={{ base: 'none', md: 'block' }}
                            >
                                Freezer Faves
                            </Text>
                        </Flex>

                        {/* Desktop Navigation */}
                        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                            <Stack direction={'row'} spacing={4}>
                                {['Home', 'Products', 'About'].map((navItem) => (
                                    <Box
                                        key={navItem}
                                        as="a"
                                        p={2}
                                        href={'#'}
                                        fontSize={'sm'}
                                        fontWeight={500}
                                        color={useColorModeValue('gray.600', 'gray.200')}
                                        _hover={{
                                            textDecoration: 'none',
                                            color: useColorModeValue('blue.500', 'white'),
                                        }}
                                        transition="all 0.2s"
                                    >
                                        {navItem}
                                    </Box>
                                ))}
                            </Stack>
                        </Flex>
                    </Flex>

                    {/* Right Side Actions */}
                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={6}
                        align="center"
                    >
                        {/* Cart Icon */}
                        <IconButton
                            aria-label="Shopping cart"
                            icon={<ShoppingCartIcon />}
                            variant="ghost"
                            position="relative"
                            _hover={{ bg: 'blue.50' }}
                        >
                            <Badge
                                colorScheme="blue"
                                position="absolute"
                                top="-2px"
                                right="-2px"
                                borderRadius="full"
                            >
                                3
                            </Badge>
                        </IconButton>

                        {/* Login/Logout Button */}
                        <Button
                            onClick={() => setIsLoggedIn(!isLoggedIn)}
                            display={{ base: 'none', md: 'inline-flex' }}
                            fontSize={'sm'}
                            fontWeight={600}
                            color={'white'}
                            bg={'blue.500'}
                            _hover={{
                                bg: 'blue.600',
                            }}
                            _active={{
                                bg: 'blue.700',
                            }}
                            transition="all 0.2s"
                        >
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </Button>
                    </Stack>
                </Flex>

                {/* Mobile Navigation */}
                <Collapse in={isOpen} animateOpacity>
                    <Stack
                        bg={useColorModeValue('white', 'gray.800')}
                        p={4}
                        display={{ md: 'none' }}
                    >
                        {['Home', 'Products', 'About'].map((navItem) => (
                            <Stack key={navItem} spacing={4}>
                                <Box
                                    as="a"
                                    href={'#'}
                                    py={2}
                                    _hover={{
                                        textDecoration: 'none',
                                        color: useColorModeValue('blue.500', 'white'),
                                    }}
                                    transition="all 0.2s"
                                >
                                    {navItem}
                                </Box>
                            </Stack>
                        ))}
                        <Button
                            onClick={() => setIsLoggedIn(!isLoggedIn)}
                            w="full"
                            fontSize={'sm'}
                            fontWeight={600}
                            color={'white'}
                            bg={'blue.500'}
                            _hover={{
                                bg: 'blue.600',
                            }}
                            _active={{
                                bg: 'blue.700',
                            }}
                            transition="all 0.2s"
                        >
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </Button>
                    </Stack>
                </Collapse>
            </Container>
        </Box>
    );
};

export default Navbar;