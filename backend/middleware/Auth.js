import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { googleAuth } from '../fairbase/config.js';

const auth = async (req, res, next) => {
    
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
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
            const decoded = jwt.verify(token, process.env.SECRET);
            const user = await User.findById(decoded._id).select('_id');
            
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: "User not found" 
                });
            }

            req.user = user;
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