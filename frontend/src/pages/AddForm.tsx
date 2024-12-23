import { HStack } from "@chakra-ui/react"
import AddProductForm from "../components/AddProduct"

const AddForm = () => {
    return (
        <HStack>
            {/* <VStack m={10} justify={'space-around'} w={'full'}>
                <AddBrandCategoryForm endpoint={'http://localhost:3500/brand'} />
                <AddBrandCategoryForm type="category" endpoint={'category'} />

            </VStack> */}
            <AddProductForm />
        </HStack>
    )
}


export default AddForm