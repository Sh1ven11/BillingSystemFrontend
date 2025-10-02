import { useContext, createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from '../../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const [loading, setLoading] = useState(true); // <-- Add a loading state
    const navigate = useNavigate();

    // The login function
    const login = useCallback(async (credentials) => {
        try {
            // ... (your existing login logic)
            const loginResponse = await authAPI.login(credentials);
            const newToken = loginResponse.data.token;
            const userDetails = loginResponse.data.user;

            localStorage.setItem("site", newToken);
            setToken(newToken);
            setUser(userDetails);
            navigate("/dashboard");
            return true;
        } catch (err) {
            console.error('Login error:', err);
            throw new Error('Login failed. Please check your credentials.');
        }
    }, [navigate]);

    // The logout function
    const logout = useCallback(() => {
        setToken("");
        setUser(null);
        localStorage.removeItem("site");
        navigate("/"); // Navigate to root after logout
    }, [navigate]);

    // The initial check for authentication
    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          const response = await authAPI.checkAuth();
          if (response.data.authenticated) {
            // Assuming your backend sends back user details on successful check
            setUser(response.data.user);
            setToken('authenticated'); // or the actual token if it's sent back
          }
        } catch (error) {
          // If check fails, user is not authenticated
          setUser(null);
          setToken("");
          localStorage.removeItem("site");
        } finally {
          setLoading(false); // Authentication check is complete
        }
      };

      checkAuthentication();
    }, []);

    const value = {
        user,
        token,
        login,
        logout,
        loading // <-- Expose loading state
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};