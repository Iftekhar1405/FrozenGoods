import { Box, Flex, VStack } from '@chakra-ui/react';
import { CheckCircle2, Eye, EyeOff, Facebook, InstagramIcon, LogIn, Phone, Twitter, User, UserPlus } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthErrors, FormData } from '../types/types';

const phoneRegex = /^[6-9]\d{9}$/;

const AuthPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    password: '',
  });

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<AuthErrors>({
    name: '',
    phoneNumber: '',
    password: '',
    general: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slideIn, setSlideIn] = useState<boolean>(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setSlideIn(true);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: AuthErrors = {
      name: '',
      phoneNumber: '',
      password: '',
    };

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const phoneWithCode = `+91${formData.phoneNumber}`;
      if (isLogin) {
        await login(phoneWithCode, formData.password);
      } else {
        await register(phoneWithCode, formData.password, formData.name);
      }
      navigate('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrors(prev => ({
        ...prev,
        general: err.response?.data?.message || 'Authentication failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'Twitter' | 'Facebook' | 'Instagram'): void => {
    console.log(`${provider} login clicked`);
  };

  const resetForm = (): void => {
    setIsLogin(!isLogin);
    setErrors({
      name: '',
      phoneNumber: '',
      password: '',
      general: '',
    });
    setFormData({ name: '', phoneNumber: '', password: '' });
  };

  return (
    <Flex
      h="100vh"
      bg="gray.50"
      alignItems="center"
      justifyContent="center"
      p={4}
      pos={'fixed'}
      top={0}
      left={0}
      w={'100vw'}
    >
      <Box
        w="full"
        maxW="md"
        transform={`translateY(${slideIn ? '0' : '40px'})`}
        opacity={slideIn ? 1 : 0}
        transition="transform 0.5s, opacity 0.5s"
      >
        <VStack spacing={6} w="full">
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="2xl"
            overflow="hidden"
            w="full"
          >
            {/* Animated Header */}
            <Box
              bgGradient="linear(to-r, blue.500, blue.600)"
              p={6}
              textAlign="center"
              position="relative"
            >
              <Box
                position="absolute"
                top={4}
                left={4}
                bg="whiteAlpha.200"
                rounded="full"
                p={2}
              >
                {isLogin ? (
                  <LogIn className="w-8 h-8 text-white" />
                ) : (
                  <UserPlus className="w-8 h-8 text-white" />
                )}
              </Box>
              <Box color="white">
                <h2 className="text-2xl font-bold">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm opacity-80 mt-2">
                  {isLogin
                    ? 'Sign in to continue your journey'
                    : 'Join our community today'}
                </p>
              </Box>
            </Box>
            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm animate-shake">
                <p>{errors.general}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all 
                    ${errors.name
                        ? 'border-red-500 ring-2 ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                  />
                  {formData.name && !errors.name && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  maxLength={10}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all 
                  ${errors.phoneNumber
                      ? 'border-red-500 ring-2 ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                />
                {formData.phoneNumber && !errors.phoneNumber && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                )}
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all 
                  ${errors.password
                      ? 'border-red-500 ring-2 ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 
                ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : (isLogin
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                      : 'bg-green-600 hover:bg-green-700 active:bg-green-800')}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>

            {/* Social Login */}
            <div className="px-6 pb-6">
              <div className="border-t pt-4 text-center">
                <p className="text-gray-500 text-sm mb-4">Or continue with</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleSocialLogin('Twitter')}
                    className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Twitter className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleSocialLogin('Facebook')}
                    className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleSocialLogin('Instagram')}
                    className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <InstagramIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </VStack>
      </Box>
    </Flex>

  );
};

export default AuthPage;