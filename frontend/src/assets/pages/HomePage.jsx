import { Container,VStack,Text, SimpleGrid } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/product";
import { ProductCard } from "../../components/productCard";

const HomePage = () => {

  const {fetchProducts,product } = useProductStore();

  useEffect(() => { 
    fetchProducts();
  }, [fetchProducts]);

  console.log('products',product);

  return (
    <Container mixW='container.xl' py={12}>
      <VStack spacing={8}>
        <Text fontSize={"30"}
        fontWeight={"bold"}
        bgGradient={"linear(to-r, cyan.400, blue.500)"}
        bgClip={"text"}
        textAlign={"center"}
        > 
          Current Products
        </Text>

        <SimpleGrid columns={{base:1,md:2,lg:3}} spacing={10} w={"full"}>
          {product.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>

        <Text fontSize={"xl"} textAlign={"center"} fontWeight={"bold"} color={"gray.500"}>
          No Product Found!
          <Link to={"/create"}>
          <Text as='span' color={'blue.500'} _hover={{textDecoration: "underline"}}>Create a Product</Text>
          </Link>
        </Text>

        
      </VStack>
    </Container>
  )
}

export default HomePage