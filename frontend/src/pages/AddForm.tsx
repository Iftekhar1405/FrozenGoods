import { HStack, VStack } from "@chakra-ui/react"
import AddBrandCategoryForm from "../components/AddBrandCategoryForm"
import AddProductForm from "../components/AddProduct"

const AddForm = () =>{
    return(
        <VStack>
        <HStack m={10} justify={'space-around'} w={'full'}>
        <AddBrandCategoryForm endpoint={'brand'} />
        <AddBrandCategoryForm type="category" endpoint={'category'} />

        </HStack>
        <AddProductForm/>
        </VStack>
    )
}


export default AddForm