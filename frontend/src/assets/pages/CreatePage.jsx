import { 
  Container, VStack, Heading, Box, useColorModeValue, Button, Input, FormControl, FormLabel, useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../../store/product";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: ""
  });
  const toast = useToast()
  const { createProduct } = useProductStore()

  const handleAddProduct = async() => {
    const {success,message} = await createProduct(newProduct);
    if(!success){
      toast({
        title:"error",
        description: message,
        status: "error",
        // duration: 5000,
        isClosable: true,
      })
      
    }else{
        toast({
          title:'success',
          description:message,
          status:"success",
          isClosable: true,
        })
    }
    setNewProduct({name:"",price:"",image:""})
  };

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={6}>
        <Heading as="h1" size="xl" textAlign="center">
          Create New Product
        </Heading>
        
        <Box 
          width="full" 
          bg={useColorModeValue("gray.50", "gray.700")} 
          p={6} 
          rounded="lg" 
          shadow="lg"
        >
          <VStack spacing={4} as="form" onSubmit={(e) => e.preventDefault()}>
            <FormControl>
              <FormLabel>Product Name</FormLabel>
              <Input 
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Product Price</FormLabel>
              <Input 
                type="number"
                placeholder="Enter product price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Product Image URL</FormLabel>
              <Input 
                type="url"
                placeholder="Enter image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </FormControl>

            <Button colorScheme="blue" onClick={handleAddProduct} w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
