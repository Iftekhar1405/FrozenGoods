import { AttachmentIcon } from "@chakra-ui/icons";
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
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

const AddBrandCategoryForm = ({
  type = "brand",
  endpoint,
  onSuccess,
  onError,
  isOpen,
  onClose,
}: any) => {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const queryClient: any = useQueryClient();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  const mutation = useMutation(
    {
      mutationKey: [endpoint],
      mutationFn: (formData: FormData) =>
        axios.post("https://frezzers-faves-api.vercel.app/" + endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }),
      onMutate: async () => {
        await queryClient.cancelQueries([type]);
        return { previousData: queryClient.getQueryData([type]) };
      },
      onSuccess: (data) => {
        toast({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Added`,
          description: `Successfully added a new ${type}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onClose();
        setName('');
        setImage(null);
        setPreviewUrl(null);

        if (onSuccess) onSuccess(data);

        // Invalidate queries to refetch data
        queryClient.invalidateQueries([type]);
      },
      onError: (error: any,) => {
        console.error(`Error adding ${type}:`, error);

        toast({
          title: 'Error',
          description:
            error.response?.data?.message ||
            `Failed to add ${type}. Please try again later.`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

        if (onError) onError(error);


      },
      onSettled: () => {
        setIsLoading(false)
      },
    }
  );

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

    mutation.mutate(formData);
  };


  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          Add New {type.charAt(0).toUpperCase() + type.slice(1)}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} as="form" id="add-form" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>
                {type.charAt(0).toUpperCase() + type.slice(1)} Name
              </FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Enter ${type} name`}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                Upload {type.charAt(0).toUpperCase() + type.slice(1)} Image
              </FormLabel>
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
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-form"
            colorScheme="blue"
            isLoading={isLoading}
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddBrandCategoryForm;