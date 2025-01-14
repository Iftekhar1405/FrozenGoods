import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    useColorModeValue,
    useToast,
    VStack
} from '@chakra-ui/react';
import { Facebook, LogIn, PersonStanding, Phone, Twitter, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const { login, register }: any = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;
        const phoneNumber = "+91" + form.phoneNumber.value;
        const password = form.password.value;
        const name = form?.name?.value


        try {
            if (isLogin) {
                await login(phoneNumber, password);
            } else {
                await register(phoneNumber, password, name);
            }
            navigate('/');
        } catch (error) {
            setError('Authentication failed. Please try again.');
            console.error('Auth error:', error);
        }
    };


    const handleSocialLogin = (provider: any) => {
        toast({
            title: `${provider} login coming soon`,
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
    };

    const bgColor = useColorModeValue('white', 'gray.800');
    const iconColor = useColorModeValue('blue.500', 'blue.300');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <VStack
            w="100vw"
            pos="absolute"
            left={0}
            top={{ base: 0, md: -10, lg: -20 }}
            px={4} // Add padding for small screens
        >
            <Box
                bg={bgColor}
                p={8}
                borderRadius="xl"
                boxShadow="xl"
                border="1px"
                borderColor={borderColor}
                w={{ base: '90%', sm: 'md', md: 'lg', lg: 'xl' }} // Responsive widths
                mx="auto"
            >
                <VStack spacing={8}>
                    <Box fontSize="3xl" color={iconColor}>
                        {isLogin ? (
                            <Icon as={LogIn} boxSize={{ base: 10, md: 12 }} />
                        ) : (
                            <Icon as={UserPlus} boxSize={{ base: 10, md: 12 }} />
                        )}
                    </Box>

                    <VStack spacing={2}>
                        <Heading size={{ base: 'md', md: 'lg' }}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Heading>
                        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">
                            {isLogin
                                ? 'Sign in to access your account'
                                : 'Create a new account to get started'}
                        </Text>
                    </VStack>

                    {error && (
                        <Alert status="error" borderRadius="md" fontSize={{ base: 'sm', md: 'md' }}>
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <VStack spacing={4} width="100%">
                            {!isLogin && (
                                <FormControl isRequired>
                                    <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Name</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={PersonStanding} color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            name="name"
                                            placeholder="Enter your name"
                                            size="lg"
                                            fontSize={{ base: 'sm', md: 'md' }}
                                        />
                                    </InputGroup>
                                </FormControl>
                            )}
                            <FormControl isRequired>
                                <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Phone</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={Phone} color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        name="phoneNumber"
                                        placeholder="Enter your phone number"
                                        size="lg"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Password</FormLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    size="lg"
                                    fontSize={{ base: 'sm', md: 'md' }}
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme={isLogin ? 'blue' : 'green'}
                                size="lg"
                                width="100%"
                                mt={4}
                            >
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </VStack>
                    </form>

                    <Button
                        variant="link"
                        colorScheme="blue"
                        fontSize={{ base: 'sm', md: 'md' }}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin
                            ? "Don't have an account? Sign up"
                            : 'Already have an account? Sign in'}
                    </Button>

                    <VStack w="100%" spacing={4}>
                        <HStack w="100%">
                            <Divider />
                            <Text
                                fontSize={{ base: 'xs', md: 'sm' }}
                                color="gray.500"
                                whiteSpace="nowrap"
                                px={4}
                            >
                                Follow us on
                            </Text>
                            <Divider />
                        </HStack>

                        <HStack spacing={4}>
                            <Button
                                variant="outline"
                                size="lg"
                                borderRadius="full"
                                onClick={() => handleSocialLogin('Twitter')}
                                _hover={{ bg: hoverBg }}
                            >
                                <Icon as={Twitter} boxSize={5} />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                borderRadius="full"
                                onClick={() => handleSocialLogin('Facebook')}
                                _hover={{ bg: hoverBg }}
                            >
                                <Icon as={Facebook} boxSize={5} />
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </Box>
        </VStack>

    );
}

