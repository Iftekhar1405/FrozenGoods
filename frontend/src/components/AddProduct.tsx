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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { BASE_URL } from "../API/urls";


// Interfaces
interface Category {
  _id: string;
  name: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Brand {
  _id: string;
  brandName: string;
  img?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// API Functions
const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${BASE_URL}/category/`);
  return response.data;
};

const fetchBrands = async (): Promise<Brand[]> => {
  const response = await axios.get(`${BASE_URL}/brand`);
  return response.data;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ isOpen, onClose }) => {
  // Form state
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [MRP, setMRP] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const toast = useToast();

  // Fetch categories and brands
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[],
    Error
  >({
    queryKey: ["product/category"],
    queryFn: fetchCategories,
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery<
    Brand[],
    Error
  >({
    queryKey: ["products/brand"],
    queryFn: fetchBrands,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const useAddProduct = (onSuccess?: () => void, onError?: () => void) => {
    const queryClient: any = useQueryClient();

    return useMutation(

      {
        mutationKey: ['products'],
        mutationFn: (formData: FormData) =>
          axios.post(`${BASE_URL}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }),
        onMutate: async () => {
          // Optionally cancel ongoing queries or implement optimistic updates here
          await queryClient.cancelQueries(['products']);
        },
        onSuccess: () => {
          toast({
            title: "Product Added",
            description: "Successfully added new product",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          queryClient.invalidateQueries(['products']); // Refetch product list
          if (onSuccess) onSuccess();
        },
        onError: (error: AxiosError) => {
          console.error("Error adding product:", error);

          toast({
            title: "Error",
            description: "Failed to add product",
            status: "error",
            duration: 3000,
            isClosable: true,
          });

          if (onError) onError();
        },
        onSettled: () => {
          queryClient.invalidateQueries(['products']); // Ensure cache is updated
        },
      }
    );
  };

  const mutation = useAddProduct()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const tagsArr = tags
      .trim()
      .split(",")
      .filter((tag) => tag.length > 0);
    const tagsArrString = JSON.stringify(tagsArr);

    if (!name || !image || !categoryId || !brandId || !MRP) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    formData.append("category", categoryId);
    formData.append("brand", brandId);
    formData.append("tags", tagsArrString);
    formData.append("MRP", MRP);
    formData.append("price", price);

    mutation.mutate(formData);
  };


  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Add New Product</DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                placeholder="Enter product name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Product Price</FormLabel>
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
              <FormLabel>Product MRP</FormLabel>
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
                value={categoryId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCategoryId(e.target.value)
                }
                isDisabled={categoriesLoading}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
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
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setBrandId(e.target.value)
                }
                isDisabled={brandsLoading}
              >
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.brandName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Input
                value={tags}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTags(e.target.value)
                }
                placeholder="Enter tags separated by commas"
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
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={mutation.isPending}
            onClick={handleSubmit}
          >
            Add Product
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddProductForm;
