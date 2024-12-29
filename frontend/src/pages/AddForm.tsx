import { HStack, VStack } from "@chakra-ui/react"
import AddBrandCategoryForm from "../components/AddBrandCategoryForm"
import AddProductForm from "../components/AddProduct"

const AddForm = () => {
    return (
        <HStack>
            <VStack m={10} justify={'space-around'} w={'full'}>
                <AddBrandCategoryForm endpoint={'https://frizzers-favess-api.vercel.app/products/brand'} />
                <AddBrandCategoryForm type="category" endpoint={'https://frizzers-favess-api.vercel.app/products/category'} />

            </VStack>
            <AddProductForm />
        </HStack>
    )
}


export default AddForm