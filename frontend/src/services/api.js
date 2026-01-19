// frontend/src/services/api.js
export const API_BASE = import.meta.env.VITE_API_URL || '';

let authToken = localStorage.getItem('authToken');

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = 'Bearer ' + authToken;
  }

  const url = API_BASE + endpoint;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.status?.message || data.error || data.errors?.[0] || 'API request failed';
    throw new Error(errorMessage);
  }

  return { data, headers: response.headers };
};
