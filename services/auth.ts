
import { User } from '../types';

const API_URL = 'http://localhost:5000/api';
const STORAGE_KEY = 'sgcsc_auth_user';

export const login = async (username: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Map backend response to frontend User type
    const user: User = {
      id: data.id,
      username: data.username,
      name: data.name,
      role: data.role,
      franchiseId: data.franchiseId, // Will be present if role is FRANCHISE
      token: data.token // Store token for future requests
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/login'; // Force redirect
};

export const checkAuth = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Helper to get headers with token
export const getAuthHeaders = () => {
  const user = checkAuth();
  return {
    'Content-Type': 'application/json',
    'Authorization': user?.token ? `Bearer ${user.token}` : ''
  };
};
