import axios from 'axios';
import React, { createContext, useCallback, useContext, useState } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = useCallback(async (phoneNumber: string, password: string) => {
        try {
            console.log(phoneNumber, password)
            const response = await axios.post('https://frezzers-faves-api.vercel.app/auth/login', {
                phoneNumber,
                password,

            }, { withCredentials: true, })
            const data: any = response.data;
            console.log(response)
            setUser(data);
        } catch (error) {
            console.log(error)
            console.error('Login error:', error);
            throw error;
        }
    }, []);

    const register = useCallback(async (phoneNumber: string, password: string, name: any) => {
        try {
            const response = await axios.post('https://frezzers-faves-api.vercel.app/auth/register', {
                credentials: 'include',
                phoneNumber,
                password,
                name
            })
            console.log(response)
            const data: any = response.data;
            setUser(data.user);
        } catch (error) {
            console.log(phoneNumber, password, name)
            console.error('Registration error:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await axios.post('https://frezzers-faves-api.vercel.app/auth/logout', {
                credentials: 'include',
            })
            setUser(null);
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