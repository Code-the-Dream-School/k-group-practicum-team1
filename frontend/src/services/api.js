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

  // const data = await response.json();
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    // non-JSON responses
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || 'API request failed');
    }

    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      data?.status?.errors?.length > 0
        ? data.status.errors.join(', ')
        : data.status?.message ||
          data.error ||
          data.errors?.[0] ||
          (typeof data === 'string' ? data : 'API request failed');
    throw new Error(errorMessage);
  }

  return { data, headers: response.headers };
};
