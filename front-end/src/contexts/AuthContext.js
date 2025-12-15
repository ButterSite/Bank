        import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
        import { BankAPI, tokenManager } from '../services/apiCalls';
        import { useError } from './ErrorContext';

        const AuthContext = createContext(null);

        export function AuthProvider({ children }) {
                const [user, setUser] = useState(null);
                const [loading, setLoading] = useState(true);
                const [isAdmin, setIsAdmin] = useState(false);
                const { setError } = useError();

                // Check if token exists on mount
                useEffect(() => {
                        const token = tokenManager.get();
                        if (token) {
                                setUser({ token });
                        }
                        setLoading(false);
                }, []);

                useEffect(() => {
                        const handleLogout = () => {
                                if (!user) return;
                                setUser(null);
                                setIsAdmin(false);
                        };
                        window.addEventListener('auth:logout', handleLogout);
                        return () => window.removeEventListener('auth:logout', handleLogout);
                }, [user]);

                const login = useCallback(async (username, password) => {
                        try {
                                const data = await BankAPI.login(username, password);
                                setUser({ username, token: data.token });
                                setIsAdmin(false);
                                return data;
                        } catch (err) {
                                setError({ code: err.status || 500, message: err.message || 'Login failed' });
                                throw err;
                        }
                }, [setError]);

                const register = useCallback(async (userData) => {
                        try {
                                const data = await BankAPI.register(userData);
                                setUser({ username: userData.username, token: data.token, userId: data.userId });
                                setIsAdmin(false);
                                return data;
                        } catch (err) {
                                setError({ code: err.status || 500, message: err.message || 'Registration failed' });
                                throw err;
                        }
                }, [setError]);

                const adminLogin = useCallback(async (username, password) => {
                        try {
                                const data = await BankAPI.adminLogin(username, password);
                                setUser({ username, token: data.token });
                                setIsAdmin(true);
                                return data;
                        } catch (err) {
                                setError({ code: err.status || 500, message: err.message || 'Admin login failed' });
                                throw err;
                        }
                }, [setError]);

                const logout = useCallback(() => {
                        tokenManager.clear();
                        setUser(null);
                        // setIsAdmin(false);
                }, []);

                const value = {
                        user,
                        isAdmin,
                        isAuthenticated: !!user,
                        loading,
                        login,
                        register,
                        adminLogin,
                        logout,
                };

                return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
        }

        export function useAuth() {
        const context = useContext(AuthContext);
        if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
        }
        return context;
        }
