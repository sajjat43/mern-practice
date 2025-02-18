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

const Signup = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

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
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Account created.',
                    description: data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                });
                navigate('/login');
            } else {
                toast({
                    title: 'Registration Failed',
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
                <Heading>Create Account</Heading>

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