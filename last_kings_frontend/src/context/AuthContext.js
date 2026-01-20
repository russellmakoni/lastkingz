import { createContext, useState, useContext, useEffect } from "react";
import api,{setAuthHeader} from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
const [user, setUser] = useState(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
        const bootstrapAuth = () => {
            try {
                const token = localStorage.getItem('userToken');
                const userData = localStorage.getItem('userData');
                if (token && userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                    setAuthHeader(token);
                }
            } catch (error) {
                console.error("Failed to restore session", error);
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
            } finally {
                setIsLoading(false);
            }
        };
        bootstrapAuth();
    }, []);

    const signIn = async (username, password) => {
        const response = await api.post('/auth/signin', { username, password });
        const { token, ...userData } = response.data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setAuthHeader(token);
        return userData;
    };

    const signUp = async (username, password) => {
        return await api.post('/auth/signup', { username, password, role: ["user"] });
    };

    const signUpAdmin = async (username, password) => {
        return await api.post('/auth/signup', { username, password, role: ["admin"] });
    };

    const signOut = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setUser(null);
        setAuthHeader(null);
    };
    
    const isAdmin = () => user?.roles?.includes('ROLE_ADMIN') ?? false;

    const authContextValue = { user, signIn, signOut, signUp, isLoading, isAdmin };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily access auth context
export const useAuth = () => {
    return useContext(AuthContext);
};