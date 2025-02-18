import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
}

export const loginUser = async (req, res) => { 
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "Email and password are required" 
        });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid email format" 
        });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Email is incorrect" 
            });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: "Password is incorrect" 
            });
        }
        const token = createToken(user._id);
        // Successful login
        res.status(200).json({ 
            success: true,
            message: "Login successful",
            data: {
                name: user.name,
                email: user.email,
                token: token
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
}

export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "All fields are required" 
        });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid email format" 
        });
    }

    // Password strength validation
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false,
            message: "Password must be at least 6 characters long" 
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Email already registered" 
            });
        }

        // Hash password - ensure password is a string
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(String(password), salt);

        // Create new user with hashed password
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword 
        });
        const token = createToken(user._id);
      
        res.status(201).json({ 
            success: true,
            message: "User created successfully",
            data: {
                name: user.name,
                email: user.email,
                token: token
            }
        });
       
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
}