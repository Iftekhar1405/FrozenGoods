import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import AddBrandCategoryForm from "../components/AddBrandCategoryForm";
import AddProductForm from "../components/AddProduct";

const AddForm = () => {
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

    return (
        <HStack spacing={4}>
            {/* Buttons to open respective drawers */}
            <Button onClick={categoryOnOpen}>Add Category</Button>
            <Button onClick={brandOnOpen}>Add Brand</Button>
            <Button onClick={productOnOpen}>Add Product</Button>

            {/* Category Drawer */}
            <AddBrandCategoryForm
                type="category"
                endpoint="https://frizzers-favess-api.vercel.app/products/category"
                isOpen={categoryIsOpen}
                onClose={categoryOnClose}
            />

            {/* Brand Drawer */}
            <AddBrandCategoryForm
                endpoint="https://frizzers-favess-api.vercel.app/products/brand"
                isOpen={brandIsOpen}
                onClose={brandOnClose}
            />

            {/* Product Form */}
            <AddProductForm isOpen={productIsOpen} onClose={productOnClose} />
        </HStack>
    );
};

export default AddForm;
