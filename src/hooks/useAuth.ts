import { useState, useEffect, useCallback } from 'react';
import { User, UseAuthReturn } from '../types';
import { toast } from 'sonner@2.0.3';

const STORAGE_KEY = 'medflashcard_user';
const SUCCESS_LOGIN = 'Login realizado com sucesso!';
const SUCCESS_LOGOUT = 'Logout realizado com sucesso!';

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin MedFlashcard',
    email: 'admin@medflashcard.com',
    password: 'admin123',
    avatar: null,
  },
  {
    id: '2',
    name: 'Estudante de Medicina',
    email: 'estudante@medicina.com',
    password: 'estudante123',
    avatar: null,
  }
];

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback((userData: User) => {
    try {
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      toast.success(SUCCESS_LOGIN);
    } catch (error) {
      console.error('Error saving user to storage:', error);
      toast.error('Erro ao fazer login');
    }
  }, []);

  const logout = useCallback(() => {
    try {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('medflashcard_preferences');
      toast.success(SUCCESS_LOGOUT);
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Erro ao fazer logout');
    }
  }, []);

  const isAuthenticated = user !== null;

  return {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };
}

// Create a separate hook for login with email/password (for backward compatibility)
export function useAuthLogin() {
  const loginWithCredentials = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
      };
      
      // Use the existing login function
      const { login } = useAuth();
      login(userWithoutPassword);
      return true;
    }
    return false;
  };

  return { loginWithCredentials };
}