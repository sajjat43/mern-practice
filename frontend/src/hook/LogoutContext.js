import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useLogoutContext = () => {
    const { dispatch } = useAuthContext();
    
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    }
    return { logout };
}