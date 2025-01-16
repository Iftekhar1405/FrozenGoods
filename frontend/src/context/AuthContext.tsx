import axios from 'axios';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (phoneNumber: string, password: string) => Promise<void>;
    register: (phoneNumber: string, password: string, name: any) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('https://frezzers-faves-api.vercel.app/auth/check', {
                    withCredentials: true,
                });
                if (response.data.user) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = useCallback(async (phoneNumber: string, password: string) => {
        try {
            const response = await axios.post(
                'https://frezzers-faves-api.vercel.app/auth/login',
                {
                    phoneNumber,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            const data: any = response.data;
            setUser(data);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }, []);

    const register = useCallback(async (phoneNumber: string, password: string, name: any) => {
        try {
            const response = await axios.post(
                'https://frezzers-faves-api.vercel.app/auth/register',
                {
                    phoneNumber,
                    password,
                    name,
                },
                {
                    withCredentials: true,
                }
            );

            const data: any = response.data;
            setUser(data.user);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await axios.post(
                'https://frezzers-faves-api.vercel.app/auth/logout',
                {},
                { withCredentials: true }
            );

            // Clear the cookie by setting it to expire in the past
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            // Clear user state
            setUser(null);

            // Optional: Redirect to login page or home page
            window.location.href = '/login'; // or wherever you want to redirect after logout
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }, []);

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}