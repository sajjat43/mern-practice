import { StrictMode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
