const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getAuthToken = () => localStorage.getItem('auth_token');

export const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);

export const removeAuthToken = () => localStorage.removeItem('auth_token');

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};
