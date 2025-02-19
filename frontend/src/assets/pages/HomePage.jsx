import { useEffect } from "react";
import { Container, VStack, Text, SimpleGrid, Spinner, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/product";
import { ProductCard } from "../../components/productCard";

const HomePage = () => {
  const { fetchProducts, product, isLoading, error } = useProductStore();
  const toast = useToast();
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await fetchProducts();
        if (!result?.success) {
          toast({
            title: 'Error',
            description: result?.message || 'Failed to fetch products',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top'
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch products',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    };

    loadProducts();
  }, [fetchProducts, toast]);

  if (isLoading) {
    return (
      <Container centerContent py={12}>
        <Spinner size="xl" color="blue.500" />
      </Container>
    );
  }

  return (
    <Container maxW='container.xl' py={12}>
      <VStack spacing={8}>
        <Text 
          fontSize="30"
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
          textAlign="center"
        > 
          Current Products
        </Text>


        {product && product.length > 0 ? (
          <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={10} w="full">
            {product.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </SimpleGrid>
        ) : (
          <Text fontSize="xl" textAlign="center" fontWeight="bold" color="gray.500">
            No Products Found!
            <Link to="/create">
              <Text 
                as='span' 
                color='blue.500' 
                ml={2}
                _hover={{textDecoration: "underline"}}
              >
                Create a Product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;