import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Image, Text, Heading, HStack, IconButton, useColorModeValue, useToast,Modal } from "@chakra-ui/react";
import { useProductStore } from "../store/product"; // Adjust the import path as necessary

export const ProductCard = ({ product }) => {  
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const {deleteProduct} = useProductStore();
  const toast = useToast();
  const handelDeleteProduct = async (pid) => {
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
      <Image src={product.image} alt={product.name} h={48} w="full" objectFit="cover" />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ${product.price}
        </Text>

        <HStack spacing={2}>
          <IconButton icon={<EditIcon />} colorScheme="blue" aria-label="Edit" />
          <IconButton icon={<DeleteIcon />} onClick={() => handelDeleteProduct(product._id)} colorScheme="red" aria-label="Delete" />
        </HStack>
      </Box>

      
    </Box>
  );
};
