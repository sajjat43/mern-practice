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
    Heading,
    Text,
    Link,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton,
    Divider,
    Center
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Signup = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { dispatch } = useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleGoogleSignup = async () => {
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
                    title: 'Success!',
                    description: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                });

                // Navigate to home page since user is now logged in
                navigate('/');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast({
                title: 'Authentication Failed',
                description: error.message || 'Failed to authenticate with Google',
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
            // First, create the account
            const signupResponse = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const signupData = await signupResponse.json();

            if (signupData.success) {
                // Then, automatically log in
                const loginResponse = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const loginData = await loginResponse.json();

                if (loginData.success) {
                    // Store user data
                    localStorage.setItem('user', JSON.stringify(loginData.data));
                    
                    // Update auth context
                    dispatch({ type: 'LOGIN', payload: loginData.data });

                    toast({
                        title: 'Account created',
                        description: 'Successfully signed up and logged in!',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: 'top'
                    });

                    navigate('/');
                } else {
                    throw new Error(loginData.message);
                }
            } else {
                throw new Error(signupData.message);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Something went wrong. Please try again.',
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
                <Heading>Create Account</Heading>

               
                <VStack spacing={4} as="form" onSubmit={handleSubmit} width="full">
                    <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </FormControl>

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
                        Sign Up
                    </Button>
                </VStack>

                <Text>
                    Already have an account?{' '}
                    <Link color="blue.500" onClick={() => navigate('/login')}>
                        Login
                    </Link>
                </Text>
            </VStack>
        </Box>
    );
};

export default Signup;