import { Button, HStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AddBrandCategoryForm from "../components/AddBrandCategoryForm";
import AddProductForm from "../components/AddProduct";
import axios from "axios";

const AddForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const toast = useToast();
    
    // State for modal visibility
    const [categoryIsOpen, setCategoryIsOpen] = useState(false);
    const [brandIsOpen, setBrandIsOpen] = useState(false);
    const [productIsOpen, setProductIsOpen] = useState(false);

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

    if (isLoading || !isAdmin) {
        return null;
    }

    const buttonStyles = {
        variant: "outline",
        bg: "transparent",
        color: "gray.700",
        borderColor: "gray.200",
        transition: "all 0.2s",
        _hover: {
            bg: "gray.50",
            borderColor: "gray.300",
            transform: "translateY(-1px)",
        }
    };

    return (
        <HStack spacing={4}>
            <Button
                {...buttonStyles}
                onClick={() => setCategoryIsOpen(true)}
            >
                Add Category
            </Button>
            
            <Button
                {...buttonStyles}
                onClick={() => setBrandIsOpen(true)}
            >
                Add Brand
            </Button>
            
            <Button
                {...buttonStyles}
                onClick={() => setProductIsOpen(true)}
            >
                Add Product
            </Button>

            <AddBrandCategoryForm
                type="category"
                endpoint="products/category"
                isOpen={categoryIsOpen}
                onClose={() => setCategoryIsOpen(false)}
            />

            <AddBrandCategoryForm
                endpoint="products/brand"
                isOpen={brandIsOpen}
                onClose={() => setBrandIsOpen(false)}
            />

            <AddProductForm 
                isOpen={productIsOpen} 
                onClose={() => setProductIsOpen(false)} 
            />
        </HStack>
    );
};

export default AddForm;