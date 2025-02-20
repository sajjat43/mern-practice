import { createContext, useReducer, useContext } from 'react';

export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw Error('useAuthContext must be used inside an AuthContextProvider');
    }
    return context;
};

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { 
                user: {
                    ...action.payload,
                    isGoogleUser: Boolean(action.payload.googleId)
                }
            };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: JSON.parse(localStorage.getItem('user'))
    });
    
    console.log('AuthContext state:', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};