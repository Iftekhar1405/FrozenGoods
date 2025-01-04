import { HStack, VStack } from "@chakra-ui/react"
import AddBrandCategoryForm from "../components/AddBrandCategoryForm"
import AddProductForm from "../components/AddProduct"

const AddForm = () => {
    return (
        <HStack>
            <VStack justify={'space-between'}>
                <AddBrandCategoryForm endpoint={'https://frizzers-favess-api.vercel.app/products/brand'} />
                <AddBrandCategoryForm type="category" endpoint={'https://frizzers-favess-api.vercel.app/products/category'} />

            </VStack>
            <AddProductForm />
        </HStack>
    )
}


export default AddForm