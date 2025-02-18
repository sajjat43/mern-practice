import { Box, useColorModeValue } from "@chakra-ui/react"
import {Routes, Route} from "react-router-dom"
import HomePage from "./assets/pages/HomePage"
import CreatePage from "./assets/pages/CreatePage"
import Navbar from "./components/Navbar"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
// import { useProductStore } from '../store/product';

function App() {
  
// const {products} = useProductStore();
  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100","gray.900")}>
      <Navbar/>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </Box>
  )
}

export default App
