import { AttachmentIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  useToast,
  VStack
} from '@chakra-ui/react';
import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';



const AddBrandCategoryForm = ({
  type = 'brand',
  endpoint,
  onSuccess,
  onError,
  isOpen,
  onClose
}: any) => {
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
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
      const response = await axios.post(`products/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setName('');
      setImage(null);
      setPreviewUrl(null);

      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Added`,
        description: `Successfully added a new ${type}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error(`Error adding ${type}:`, error);

      toast({
        title: 'Error',
        description: `Failed to add ${type}. Please try again later.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={'sm'}>
      < DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          Add New {type.charAt(0).toUpperCase() + type.slice(1)}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
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
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer >

  );
};

export default AddBrandCategoryForm;
