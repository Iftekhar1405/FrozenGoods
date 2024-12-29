import { LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

const RegisterComponent = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    password: '',
  });
  const toast = useToast();

  // Handle phone number input
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters
    const value = e.target.value.replace(/\D/g, '');

    // Limit to 10 digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      // Clear error if it exists
      if (errors.phoneNumber) {
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
      }
    }
  };

  // Validation functions
  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (pass: string) => {
    return pass.length >= 8;
  };

  const validateInputs = () => {
    const newErrors = {
      name: '',
      phoneNumber: '',
      password: '',
    };

    let isValid = true;

    if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters long';
      isValid = false;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit Indian phone number';
      isValid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        'https://frizzers-favess-api.vercel.app/auth/register',
        {
          name: name.trim(),
          phoneNumber: `+91${phoneNumber}`, // Add +91 prefix here
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Switch to OTP verification form


    } catch (error) {
      let errorMessage = 'Registration failed';

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.phoneNumber}>
          <FormLabel>Phone Number</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.500"
              fontSize="1em"
              children="+91"
            />
            <Input
              type="tel"
              pl="4rem"
              placeholder="Enter 10 digit number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={10}
            />
          </InputGroup>
          <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <LockIcon color="gray.500" />
            </InputLeftElement>
            <Input
              type={showPassword ? "text" : "password"}
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
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="blue"
          type="submit"
          width="full"
          isLoading={isLoading}
          loadingText="Registering..."
        >
          Register
        </Button>
      </VStack>
    </form>
  );
};

export default RegisterComponent;