import { Container, Flex,Text ,HStack,Button, useColorMode} from '@chakra-ui/react'
import { IoCreateSharp } from "react-icons/io5";
// import { FaCartPlus } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import { MdModeNight } from "react-icons/md";
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { useAuthContext } from '../context/AuthContext';
// import { useProductStore } from '../store/product';

const Navbar = () => {
  const { dispatch } = useAuthContext();
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };
  const { colorMode, toggleColorMode  } = useColorMode();
  // const {products} = useProductStore();
  return  <Container maxW={"1540px"} px={4}  >
    <Flex 
    h={16}
    pt={4}
    alignItems={'center'}
    justifyContent={'space-between'}
    flexDir={{
        base:"column",
        sm:"row"
    }}
    >
        <Text 
        fontSize={{ base: "22", sm: "28"}} 
        fontWeight={"bold"}
        textTransform={"uppercase"} 
        textAlign={"center"}
        bgGradient="linear(to-r, cyan.400, blue.500)"
        bgClip={"text"} >


           <Link to={"/"} >Product Store 🚀</Link> 
        </Text>
        <HStack spacing={2} alignItems={"center"}>
          <Link to="/create">
          <Button on><IoCreateSharp fontSize={20} /></Button>
          </Link>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light'  ? <MdModeNight /> :   <IoSunnySharp />}
          </Button>
          <Link to="/login">
          <Button on><CiLogin  fontSize={20} /></Button>
          </Link>
          <Link to="/signup">
          <Button on>Sign Up</Button>
          </Link>
          <button onClick={logout}>LogOut</button>
        </HStack>
    </Flex>
  </Container>
}

export default Navbar