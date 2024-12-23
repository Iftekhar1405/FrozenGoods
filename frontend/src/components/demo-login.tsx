import { useState } from "react";
import axios from "axios";
// import Cookies from "js-cookie";
import {
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const LoginComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ phoneNumber: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Handle phone number input
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters
    const value = e.target.value.replace(/\D/g, "");

    // Limit to 10 digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      // Clear error if it exists
      if (errors.phoneNumber) {
        setErrors((prev) => ({ ...prev, phoneNumber: "" }));
      }
    }
  };

  // Validation functions
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (pass: string) => {
    return pass.length >= 8;
  };

  const validateInputs = () => {
    const newErrors = {
      phoneNumber: "",
      password: "",
    };

    let isValid = true;

    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid 10-digit Indian phone number";
      isValid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3500/auth/login",
        {
          phoneNumber: `+91${phoneNumber}`, // Add +91 prefix here
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // You can redirect here if needed
      // navigate('/dashboard');
    } catch (error) {
      let errorMessage = "Login failed";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired isInvalid={!!errors.phoneNumber}>
          <FormLabel>Phone No:</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <EmailIcon color="gray.500" />
            </InputLeftElement>
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
          loadingText="Logging in..."
        >
          Login
        </Button>
      </VStack>
    </form>
  );

  return renderLoginForm();
};

export default LoginComponent;
