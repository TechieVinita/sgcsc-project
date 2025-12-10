import { User, UserRole } from '../types';

const STORAGE_KEY = 'sgc_auth_user';

export const login = async (username: string, password: string): Promise<User> => {
  // SIMULATED AUTHENTICATION
  // In a real app, this would be an API call to a Node.js/Express backend
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        const user: User = { id: 'admin1', username: 'admin', name: 'Super Admin', role: UserRole.ADMIN };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      } else if (username === 'franchise' && password === 'franchise') {
        const user: User = { id: 'f1', username: 'franchise', name: 'Rajesh Kumar', role: UserRole.FRANCHISE, franchiseId: 'f1' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};

export const checkAuth = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};