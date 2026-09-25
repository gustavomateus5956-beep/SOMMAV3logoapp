import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { repositories } from '../data';

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
  logout: () => void | Promise<void>;
  updateUser: (data: Partial<UserProfile>) => void | Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check persisted session on initial mount
  useEffect(() => {
    let isMounted = true;
    repositories.user
      .getSession()
      .then((activeUser) => {
        if (isMounted && activeUser) {
          setUser(activeUser);
        }
      })
      .catch((error) => {
        console.error('Falha ao restaurar sessão de usuário:', error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const foundUser = await repositories.user.getUserByEmail(cleanEmail);

      if (!foundUser) {
        return { success: false, message: 'Nenhuma conta encontrada com este e-mail.' };
      }

      if (foundUser.password && foundUser.password !== password) {
        return { success: false, message: 'Senha incorreta. Verifique e tente novamente.' };
      }

      // Save session in repository
      await repositories.user.saveSession(foundUser.id);
      setUser(foundUser);
      return { success: true };
    } catch (error) {
      console.error('Falha ao efetuar login:', error);
      return { success: false, message: 'Falha ao processar o login. Tente novamente.' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();

    try {
      // Check duplicate
      const existing = await repositories.user.getUserByEmail(cleanEmail);
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

      await repositories.user.saveUser(newUser);
      await repositories.user.saveSession(newUser.id);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Falha ao registrar usuário:', error);
      return { success: false, message: 'Falha ao registrar conta. Tente novamente.' };
    }
  };

  const logout = async () => {
    try {
      await repositories.user.removeSession();
    } catch (error) {
      console.error('Falha ao encerrar sessão:', error);
    }
    setUser(null);
  };

  const updateUser = async (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    try {
      await repositories.user.saveUser(updated);
    } catch (error) {
      console.error('Falha ao salvar atualização do usuário no repositório:', error);
    }
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
