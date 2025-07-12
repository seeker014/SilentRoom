import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Get user from localStorage if exists
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    });

    // Login user and store in state + localStorage
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout user
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth hook for easy import
export const useAuth = () => {
    return useContext(AuthContext);
};
