// frontend/src/services/auth.js
import { apiFetch, setAuthToken } from './api';

export const login = async (credentials) => {
  const { data } = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ user: credentials }),
  });

  // Token is in body status.token for this backend
  if (data.status?.token) {
    setAuthToken(data.status.token);
  }

  // Fetch user data after login since /login only returns token
  const userResponse = await apiFetch('/api/v1/me');
  return userResponse.data;
};

export const signup = async (userData) => {
  const { data } = await apiFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({ user: userData }),
  });

  // Token may be in response header or body
  if (data.status?.token) {
    setAuthToken(data.status.token);
  }

  return data.data?.user || data.data;
};

export const logout = async () => {
  try {
    await apiFetch('/logout', { method: 'DELETE' });
  } finally {
    setAuthToken(null);
  }
};

export const getCurrentUser = async () => {
  const { data } = await apiFetch('/api/v1/me');
  return data;
};
