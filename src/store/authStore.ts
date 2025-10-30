import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  created_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  logout: () => void;
}

const USERS_STORAGE_KEY = 'exam-system-users';

const getStoredUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveUser = (user: StoredUser) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const findUser = (email: string, password: string, role: 'teacher' | 'student'): StoredUser | null => {
  const users = getStoredUsers();
  return users.find(u => u.email === email && u.password === password && u.role === role) || null;
};

const userExists = (email: string): boolean => {
  const users = getStoredUsers();
  return users.some(u => u.email === email);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string, role: 'teacher' | 'student') => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const storedUser = findUser(email, password, role);

        if (!storedUser) {
          throw new Error('Invalid email, password, or role');
        }

        const user: User = {
          id: storedUser.id,
          name: storedUser.name,
          email: storedUser.email,
          role: storedUser.role,
          created_at: storedUser.created_at,
        };

        set({ user, isAuthenticated: true });
      },

      register: async (name: string, email: string, password: string, role: 'teacher' | 'student') => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (userExists(email)) {
          throw new Error('User with this email already exists');
        }

        const storedUser: StoredUser = {
          id: Math.random().toString(36).substring(2) + Date.now().toString(36),
          name,
          email,
          password,
          role,
          created_at: new Date().toISOString(),
        };

        saveUser(storedUser);

        const user: User = {
          id: storedUser.id,
          name: storedUser.name,
          email: storedUser.email,
          role: storedUser.role,
          created_at: storedUser.created_at,
        };

        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
