import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Box, Image, Text, Heading, HStack, IconButton, 
  useColorModeValue, useToast, Modal, useDisclosure,
   ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
   ModalBody,VStack, ModalFooter, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useProductStore } from "../store/product"; // Adjust the import path as necessary

export const ProductCard = ({ product }) => {  

  const [updatedProduct, setUpdatedProduct] = useState(product);

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {deleteProduct,updateProduct} = useProductStore();

  const toast = useToast();
  const handleDeleteProduct = async (pid) => {
    const {success, message} = await deleteProduct(pid);
    if(!success){
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }else{
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }
  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success, message } = await updateProduct(pid, updatedProduct);
    onClose();
  
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else {
      toast({
        title: "Success",
        description: "Product updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Box 
      shadow="lg" 
      rounded="lg" 
      overflow="hidden" 
      transition="all 0.3s ease-in-out" 
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }} 
      bg={bg} 
      w="full"
    >
      <Image src={product?.image} alt={product?.name} h={48} w="full" objectFit="cover" />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product?.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ${product.price}
        </Text>

        <HStack spacing={2}>
          <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme="blue" aria-label="Edit" />
          <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)} colorScheme="red" aria-label="Delete" />
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent> 
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Product Name</FormLabel>
                <Input 
                  type="text" 
                  placeholder="Product Name"
                  name="name" 
                  value={updatedProduct.name}
                  onChange={(e) => setUpdatedProduct({...updatedProduct, name: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Product Price</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Product Price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={updatedProduct.price}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0) {
                      setUpdatedProduct({...updatedProduct, price: value});
                    }
                  }} 
                />
              </FormControl>
              <FormControl>
                <FormLabel>Product Image URL</FormLabel>
                <Input 
                  type="text" 
                  placeholder="Product Image URL"
                  name="image"
                  value={updatedProduct.image}
                  onChange={(e) => setUpdatedProduct({...updatedProduct, image: e.target.value})} 
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
