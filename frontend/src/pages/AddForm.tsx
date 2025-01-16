import { Button, HStack, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AddBrandCategoryForm from "../components/AddBrandCategoryForm";
import AddProductForm from "../components/AddProduct";

const AddForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const toast = useToast();

    // Separate calls to useDisclosure
    const {
        isOpen: categoryIsOpen,
        onOpen: categoryOnOpen,
        onClose: categoryOnClose,
    } = useDisclosure();

    const {
        isOpen: brandIsOpen,
        onOpen: brandOnOpen,
        onClose: brandOnClose,
    } = useDisclosure();

    const {
        isOpen: productIsOpen,
        onOpen: productOnOpen,
        onClose: productOnClose,
    } = useDisclosure();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get(
                    'https://frezzers-faves-api.vercel.app/auth/check',
                    { withCredentials: true }
                );

                setIsAdmin(response.data.user?.role === 'admin');
            } catch (error: any) {
                console.error('Auth check failed:', error);
                setIsAdmin(false);

                // Only show error toast if it's not a 401/403 error
                if (error.response?.status !== 401 && error.response?.status !== 403) {
                    toast({
                        title: "Error",
                        description: "Failed to verify authentication status",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, [toast]);

    // Show nothing while loading or if not admin
    if (isLoading || !isAdmin) {
        return null;
    }

    return (
        <HStack spacing={4}>
            <Button onClick={categoryOnOpen}>Add Category</Button>
            <Button onClick={brandOnOpen}>Add Brand</Button>
            <Button onClick={productOnOpen}>Add Product</Button>

            <AddBrandCategoryForm
                type="category"
                endpoint="products/category"
                isOpen={categoryIsOpen}
                onClose={categoryOnClose}
            />

            <AddBrandCategoryForm
                endpoint="products/brand"
                isOpen={brandIsOpen}
                onClose={brandOnClose}
            />

            <AddProductForm
                isOpen={productIsOpen}
                onClose={productOnClose}
            />
        </HStack>
    );
};

export default AddForm;