import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthenticationContext = createContext(null);

export const AuthenticationProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const initializeAuth = () => {
          try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            const storedAuthStatus = localStorage.getItem('isAuthenticated');
            
            if (storedToken && storedUser && storedAuthStatus === 'true') {
              setToken(storedToken);
              setCurrentUser(JSON.parse(storedUser));
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error initializing auth state:', error);
            logout();
          } finally {
            setLoading(false);
          }
        };
    
        initializeAuth();
    }, []);
    
    const login = (userData, authToken) => {
        
        setCurrentUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        localStorage.setItem('isAuthenticated', 'true');
      
       
        const navigate = useNavigate();
        navigate('/home');
    };
    
    const logout = () => {
        
        setCurrentUser(null);
        setToken(null);
        setIsAuthenticated(false);
        
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
    };

    const updateUserProfile = (updatedUserData) => {
        const updatedUser = { ...currentUser, ...updatedUserData };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      };
    
      
    const getAuthHeader = () => {
        console.log("getAuthHeader called: ", token);
        return token ? { Authorization: `Bearer ${token}` } : {};
    };
    const contextValue = {
        currentUser,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUserProfile,
        getAuthHeader
    };
    return (
        <AuthenticationContext.Provider value={contextValue}>
          {children}
        </AuthenticationContext.Provider>
      );
}

export const useAuth = () => {
    const context = useContext(AuthenticationContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
  