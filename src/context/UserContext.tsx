import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check persisted session on initial mount
  useEffect(() => {
    try {
      const activeUser = storageService.getSession();
      if (activeUser) {
        setUser(activeUser);
      }
    } catch (error) {
      console.error('Falha ao restaurar sessão de usuário:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = storageService.getUserByEmail(cleanEmail);

    if (!foundUser) {
      return { success: false, message: 'Nenhuma conta encontrada com este e-mail.' };
    }

    if (foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Senha incorreta. Verifique e tente novamente.' };
    }

    // Save session in localStorage
    storageService.saveSession(foundUser.id);
    setUser(foundUser);
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();

    // Check duplicate
    const existing = storageService.getUserByEmail(cleanEmail);
    if (existing) {
      return { success: false, message: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const initialUsername = cleanName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_.]/g, '')
      .slice(0, 20) || `atleta_${Date.now().toString().slice(-4)}`;

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: cleanName,
      username: initialUsername,
      email: cleanEmail,
      password: data.password,
      role: 'Atleta Iniciante',
      joinedDate: 'Hoje',
      age: 25,
      weight: 70,
      height: 1.75,
      totalWorkouts: 0,
      totalPrs: 0,
      streakDays: 1,
      goal: 'Condicionamento & Hipertrofia',
      plan: 'SOMMA Free',
      linkedProfessionalIds: [],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0066ff`,
    };

    storageService.saveUser(newUser);
    storageService.saveSession(newUser.id);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    storageService.removeSession();
    setUser(null);
  };

  const updateUser = (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    storageService.saveUser(updated);
    setUser(updated);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser utilizado dentro de um UserProvider');
  }
  return context;
};
