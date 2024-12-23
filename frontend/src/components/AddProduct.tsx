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
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { fetchBrands } from './Filter';

const AddProductForm = () => {
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [MRP, setMRP] = useState('')
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setcategory] = useState('');
  const [brand, setbrand] = useState('');
  const [tags, setTags] = useState('')

  // Dropdown data state
  const [categories, setCategories] = useState([
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Books' },
    { id: '4', name: 'Care' }
  ]);

  const { data: brands, isLoading: brandsLoading }: any = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands
  }
  );

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


    const tagsArr = tags.trim().split(',')
    const tagsArrString = JSON.stringify(tagsArr)
    // Validate required fields

    if (!name || !image || !category || !brand || !MRP) {
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
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('tags', tagsArrString);
    formData.append('MRP', MRP);
    formData.append('price', price);


    setIsLoading(true);
    console.log(formData)
    try {
      const response: any = await axios.post('http://localhost:3500/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },

      }
      );
      // console.log(response)
      // if (!response.ok) {
      //   throw new Error('Failed to add product');
      // }

      const result = await response.data;
      console.log(result)

      // Reset form
      setName('');
      setPrice('');
      setImage(null);
      setPreviewUrl(null);
      setcategory('');
      setbrand('');
      setMRP('')
      setTags('')

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

        <FormControl isRequired>
          <FormLabel>Product Price </FormLabel>
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
          <FormLabel>Product MRP </FormLabel>
          <NumberInput
            value={MRP}
            onChange={(valueString) => setMRP(valueString)}
          >
            <NumberInputField placeholder="Enter product MRP" />
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
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Brand</FormLabel>
          <Select
            placeholder="Select brand"
            value={brand}
            onChange={(e) => setbrand(e.target.value)}
          >
            {brands?.map((brand: any) => (
              <option key={brand?._id} value={brand?._id}>
                {brand?.brandName}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl >
          <FormLabel>Tags</FormLabel>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags here"
          />
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