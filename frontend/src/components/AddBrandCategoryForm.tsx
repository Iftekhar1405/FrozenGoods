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
  useToast,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';

const AddBrandCategoryForm = ({
  type = 'brand',
  endpoint,
  onSuccess,
  onError
}: any) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

    if (!name || !image) {
      toast({
        title: 'Validation Error',
        description: 'Please provide both name and image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add ' + type);
      }

      const result = await response.json();

      setName('');
      setImage(null);
      setPreviewUrl(null);

      // Show success toast
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Added`,
        description: `Successfully added new ${type}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);

      // Show error toast
      toast({
        title: 'Error',
        description: `Failed to add ${type}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      // Call error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW={'2xl'}
      width="full"
      borderWidth={1}
      borderRadius="lg"
      p={6}
      boxShadow="md"

    >
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Heading size="md" textAlign="center">
          Add New {type.charAt(0).toUpperCase() + type.slice(1)}
        </Heading>

        <FormControl isRequired>
          <FormLabel>{type.charAt(0).toUpperCase() + type.slice(1)} Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${type} name`}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Upload {type.charAt(0).toUpperCase() + type.slice(1)} Image</FormLabel>
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
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </VStack>
    </Box>
  );
};

export default AddBrandCategoryForm;