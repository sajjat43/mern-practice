import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: "Authorization token required" 
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Token not provided" 
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.SECRET);
            
            // Check if user exists
            const user = await User.findOne({ _id: decoded._id });
            
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: "User not found" 
                });
            }

            // Attach user to request
            req.user = {
                _id: user._id,
                name: user.name,
                email: user.email
            };

            next();

        } catch (error) {
            console.log('Token verification error:', error);
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token" 
            });
        }

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

export default auth;