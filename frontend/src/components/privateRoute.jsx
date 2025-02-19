import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user } = useAuthContext();
    const location = useLocation();
    
    // Check if user exists in context
    const isAuthenticated = Boolean(user);
    
    if (!isAuthenticated) {
        // Redirect to login while saving the attempted url
        return (
            <Navigate 
                to="/login" 
                state={{ from: location.pathname }}
                replace 
            />
        );
    }

    // If authenticated, render the protected component
    return children;
};

export default PrivateRoute;