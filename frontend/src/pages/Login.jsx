import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    Link,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuthContext } from '../context/AuthContext';
import { signInWithPopup } from '../fairbase/config';
const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { dispatch } = useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup();
            console.log(result);
        } catch (error) {
            console.error(error);   
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Store both user data and token
                localStorage.setItem('user', JSON.stringify({
                    name: data.data.name,
                    email: data.data.email,
                    token: data.data.token  // Make sure to store the token
                }));
                
                dispatch({ 
                    type: 'LOGIN', 
                    payload: {
                        name: data.data.name,
                        email: data.data.email,
                        token: data.data.token
                    }
                });

                toast({
                    title: 'Welcome back!',
                    description: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                });
                
                navigate('/');
            } else {
                toast({
                    title: 'Login Failed',
                    description: data.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Heading>Welcome Back</Heading>

                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                        <InputRightElement>
                            <IconButton
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={() => setShowPassword(!showPassword)}
                                variant="ghost"
                                size="sm"
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button
                    colorScheme="blue"
                    width="full"
                    type="submit"
                    isLoading={isLoading}
                >
                    Login
                </Button>

                <Text>
                    Don&apos;t have an account?{' '}
                    <Link color="blue.500" onClick={() => navigate('/signup')}>
                        Sign Up
                    </Link>
                </Text>
                <Button onClick={() => signInWithGoogle()}>Sign in with Google</Button>
            </VStack>
        </Box>
    );
};

export default Login;   