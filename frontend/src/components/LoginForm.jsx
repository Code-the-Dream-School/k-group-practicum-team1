// frontend/src/components/LoginForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/auth';
import { FormInput } from './FormInput';

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
      <h1 className="text-2xl font-bold text-indigo-700 mb-1">Turbo Loan</h1>
      <h2 className="text-xl text-gray-700 mb-6">Welcome back</h2>
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="mb-6"
        />
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
