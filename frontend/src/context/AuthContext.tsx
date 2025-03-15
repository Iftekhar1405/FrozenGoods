import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BASE_URL } from "../API/urls";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (phoneNumber: string, password: string, name: string) => Promise<void>;
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
        const response = await axios.get(
          `${BASE_URL}auth/check`,
          {
            withCredentials: true,
          }
        );
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Auth check error:", error);
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
        `${BASE_URL}auth/login`,
        {
          phoneNumber,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // Ensure we're setting the user data consistently
      const userData = response.data.user || response.data;
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const register = useCallback(
    async (phoneNumber: string, password: string, name: string) => {
      try {
        const response = await axios.post(
          `${BASE_URL}auth/register`,
          {
            phoneNumber,
            password,
            name,
          },
          {
            withCredentials: true,
          }
        );

        // Ensure we're setting the user data consistently
        const userData = response.data.user || response.data;
        setUser(userData);

        // Perform an immediate auth check to ensure everything is synchronized
        await axios.get(`${BASE_URL}auth/check`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${BASE_URL}auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}