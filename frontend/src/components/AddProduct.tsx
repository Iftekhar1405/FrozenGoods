import { AttachmentIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';

const AddProductForm = () => {
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');

  // Dropdown data state
  const [categories, setCategories] = useState([
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Books' }
  ]);
  const [brands, setBrands] = useState([
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Samsung' },
    { id: '3', name: 'Nike' }
  ]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const toast = useToast();

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !image || !categoryId || !brandId) {
      toast({
        title: 'Validation Error',
        description: 'Please provide product name, image, category, and brand',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('categoryId', categoryId);
    formData.append('brandId', brandId);

    // Price is optional
    if (price) {
      formData.append('price', price);
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const result = await response.json();

      // Reset form
      setName('');
      setPrice('');
      setImage(null);
      setPreviewUrl(null);
      setCategoryId('');
      setBrandId('');

      // Show success toast
      toast({
        title: 'Product Added',
        description: 'Successfully added new product',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error adding product:', error);

      // Show error toast
      toast({
        title: 'Error',
        description: 'Failed to add product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxWidth="md"
      width="full"
      borderWidth={1}
      borderRadius="lg"
      p={6}
      boxShadow="md"
    >
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Heading size="lg" textAlign="center">
          Add New Product
        </Heading>

        <FormControl isRequired>
          <FormLabel>Product Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Product Price (Optional)</FormLabel>
          <NumberInput
            value={price}
            onChange={(valueString) => setPrice(valueString)}
          >
            <NumberInputField placeholder="Enter product price" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Category</FormLabel>
          <Select
            placeholder="Select category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Brand</FormLabel>
          <Select
            placeholder="Select brand"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Upload Product Image</FormLabel>
          <Flex alignItems="center" gap={4}>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
              id="image-upload"
            />
            <Button
              as="label"
              htmlFor="image-upload"
              leftIcon={<AttachmentIcon />}
              variant="outline"
              cursor="pointer"
            >
              Choose Image
            </Button>

            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview"
                boxSize="16"
                objectFit="cover"
                borderRadius="md"
              />
            )}
          </Flex>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
        >
          Add Product
        </Button>
      </VStack>
    </Box>
  );
};

export default AddProductForm;