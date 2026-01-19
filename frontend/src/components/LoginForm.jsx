// frontend/src/components/LoginForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/auth';

export const LoginForm = ({ onSwitchToSignup, onLoginSuccess }) => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await loginApi({ email, password });
      setUser(user);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-1">Auto Loan</h1>
      <h2 className="text-xl text-gray-700 mb-6">Welcome back</h2>
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      {onSwitchToSignup && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Do not have an account?{' '}
            <button onClick={onSwitchToSignup} className="text-indigo-600 hover:underline">
              Sign up
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

LoginForm.propTypes = {
  onSwitchToSignup: PropTypes.func,
  onLoginSuccess: PropTypes.func,
};

export default LoginForm;
