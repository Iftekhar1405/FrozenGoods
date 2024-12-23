import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Alert,
    AlertIcon,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    PinInput,
    PinInputField,
    useToast,
    VStack
} from '@chakra-ui/react';
import { useState } from 'react';

const AuthForm = () => {
    const [formType, setFormType] = useState('login'); // login, register, otp
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const toast = useToast();

    const handleRegister = (e: any) => {
        e.preventDefault();
        // In a real app, you would make an API call here
        setMessage('OTP sent to your email');
        toast({
            title: 'OTP Sent',
            description: 'Please check your email for the verification code',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setFormType('otp');
    };

    const handleLogin = (e: any) => {
        e.preventDefault();
        // In a real app, you would make an API call here
        toast({
            title: 'Login Successful',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleVerifyOTP = (value: any) => {
        // In a real app, you would verify OTP here
        setMessage('Registration successful');
        toast({
            title: 'Registration Successful',
            description: 'You can now login with your credentials',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setFormType('login');
    };

    const renderOTPForm = () => (
        <VStack spacing={6} align="stretch">
            <FormControl>
                <FormLabel textAlign="center">Enter the verification code sent to your email</FormLabel>
                <HStack justify="center" spacing={4}>
                    <PinInput size="lg" otp onChange={handleVerifyOTP}>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                    </PinInput>
                </HStack>
            </FormControl>
        </VStack>
    );

    const renderLoginForm = () => (
        <VStack spacing={4} align="stretch">
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                    <InputLeftElement>
                        <EmailIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </InputGroup>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <InputLeftElement>
                        <LockIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        position="absolute"
                        right="1"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                    >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                </InputGroup>
            </FormControl>

            <Button colorScheme="blue" onClick={handleLogin} width="full">
                Login
            </Button>
        </VStack>
    );

    const renderRegisterForm = () => (
        <VStack spacing={4} align="stretch">
            <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                    <InputLeftElement>
                        <EmailIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </InputGroup>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <InputLeftElement>
                        <LockIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        position="absolute"
                        right="1"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                    >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                </InputGroup>
            </FormControl>

            <Button colorScheme="blue" onClick={handleRegister} width="full">
                Register
            </Button>
        </VStack>
    );

    return (
        <Container maxW="md" py={8}>
            <Card>
                <CardHeader>
                    <Heading size="lg" textAlign="center">
                        {formType === 'login' ? 'Login' : formType === 'register' ? 'Register' : 'Verify OTP'}
                    </Heading>
                </CardHeader>

                <CardBody>
                    {message && (
                        <Alert status="success" mb={4}>
                            <AlertIcon />
                            {message}
                        </Alert>
                    )}

                    {formType === 'login' && renderLoginForm()}
                    {formType === 'register' && renderRegisterForm()}
                    {formType === 'otp' && renderOTPForm()}
                </CardBody>

                <CardFooter justify="center">
                    {formType === 'login' ? (
                        <Button variant="link" onClick={() => setFormType('register')}>
                            Don't have an account? Register
                        </Button>
                    ) : formType === 'register' ? (
                        <Button variant="link" onClick={() => setFormType('login')}>
                            Already have an account? Login
                        </Button>
                    ) : null}
                </CardFooter>
            </Card>
        </Container>
    );
};

export default AuthForm;