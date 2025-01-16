import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
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
    InputRightElement,
    Text,
    useColorModeValue,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { Facebook, LogIn, PersonStanding, Phone, Twitter, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, register }: any = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const form: any = e.currentTarget;
        const phoneNumber = form.phoneNumber?.value
            ? `+91${form.phoneNumber.value}`
            : null;
        const password = form.password?.value || null;
        const name = form?.name?.value || null;

        if (!phoneNumber || !password || (!isLogin && !name)) {
            setError('Please fill out all required fields.');
            setIsLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await login(phoneNumber, password);
            } else {
                await register(phoneNumber, password, name);
            }
            navigate('/');
        } catch (error:any) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Show backend error message
            } else {
                setError('Authentication failed. Please try again.');
            }
            // setError('Authentication failed. Please try again.');
            console.error('Auth error:', error);
        } finally {
            setIsLoading(false); // Stop loading spinner
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
            top={{ base: 0, md: -10, lg: -15 }}
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
                                    <InputLeftElement
                                        pointerEvents="none"
                                        display="flex"
                                        alignItems="center"
                                        height="100%" // Ensures it spans the full height of the input
                                    >
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
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter your password"
                                        size="lg"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                    />
                                    <InputRightElement height="100%" pr={2}>
                                        <Icon
                                            as={showPassword ? ViewOffIcon : ViewIcon}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            cursor="pointer"
                                            color="gray.400"
                                            boxSize={5}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme={isLogin ? 'blue' : 'green'}
                                size="lg"
                                width="100%"
                                mt={4}
                                isLoading={isLoading} // Replace `isLoading` with your loading state
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

