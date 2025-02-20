import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from '../fairbase/config';
import { FcGoogle } from 'react-icons/fc';
import { useAuthContext } from '../context/AuthContext';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    Link,
    useToast,
    Heading,
    Divider,
    Center
} from '@chakra-ui/react';

const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { dispatch } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            
            const response = await fetch('/api/users/google-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    googleId: result.user.uid,
                    photoURL: result.user.photoURL
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.data));
                
                // Update auth context
                dispatch({ type: 'LOGIN', payload: data.data });

                toast({
                    title: 'Welcome back!',
                    description: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                });

                // Navigate to home page
                navigate('/');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast({
                title: 'Login Failed',
                description: error.message || 'Failed to login with Google',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                // Store user data
                localStorage.setItem('user', JSON.stringify(data.data));
                
                // Update auth context
                dispatch({ type: 'LOGIN', payload: data.data });

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
                throw new Error(data.message);
            }
        } catch (error) {
            toast({
                title: 'Login Failed',
                description: error.message || 'Invalid email or password',
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
            <VStack spacing={4}>
                <Heading>Login</Heading>

                <Button
                    w="full"
                    leftIcon={<FcGoogle />}
                    onClick={handleGoogleLogin}
                    variant="outline"
                    isLoading={isLoading}
                >
                    Login with Google
                </Button>

                <Center w="full">
                    <Divider />
                    <Text px={3} color="gray.500">OR</Text>
                    <Divider />
                </Center>

                <VStack as="form" onSubmit={handleSubmit} spacing={4} w="full">
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
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        isLoading={isLoading}
                    >
                        Login
                    </Button>
                </VStack>

                <Text>
                    Don't have an account?{' '}
                    <Link color="blue.500" onClick={() => navigate('/signup')}>
                        Sign Up
                    </Link>
                </Text>
            </VStack>
        </Box>
    );
};

export default Login;   