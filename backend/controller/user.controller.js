import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create token
        const token = jwt.sign(
            { _id: user._id },
            process.env.SECRET,
            { expiresIn: '24h' }
        );

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                name: user.name,
                email: user.email,
                token: token  // Include token in response
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

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

export const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export const googleSignup = async (req, res) => {
    try {
        const { email, name, googleId, photoURL } = req.body;

        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { googleId }] });
        
        if (user) {
            // If user exists, update their Google ID if they don't have one
            if (!user.googleId) {
                user.googleId = googleId;
                user.photoURL = photoURL;
                await user.save();
            }
        } else {
            // Create new user if doesn't exist
            user = await User.create({
                email,
                name,
                googleId,
                photoURL
            });
        }

        // Generate token
        const token = jwt.sign(
            { _id: user._id },
            process.env.SECRET,
            { expiresIn: '7d' }
        );

        // Return user data and token
        res.status(200).json({
            success: true,
            message: user ? "Logged in successfully" : "Account created and logged in successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                googleId: user.googleId,
                token
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: "Server error during authentication"
        });
    }
};