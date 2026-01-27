// frontend/src/components/SignupForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { signup as signupApi, getCurrentUser } from '../services/auth';
import { FormInput } from './FormInput';

export const SignupForm = ({ onSwitchToLogin, onSignupSuccess, onLoginSuccess }) => {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await signupApi(formData);
      const user = await getCurrentUser();
      setUser(user);
      const callback = onSignupSuccess || onLoginSuccess;
      if (callback) {
        console.log('Calling success callback with user:', user);
        callback(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-1">Turbo Loan</h1>
      <h2 className="text-xl text-gray-700 mb-6">Create your account</h2>
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormInput
            id="first_name"
            label="First Name"
            type="text"
            value={formData.first_name}
            onChange={handleChange('first_name')}
            required
            className=""
          />
          <FormInput
            id="last_name"
            label="Last Name"
            type="text"
            value={formData.last_name}
            onChange={handleChange('last_name')}
            required
            className=""
          />
        </div>
        <FormInput
          id="phone_number"
          label="Phone Number"
          type="tel"
          value={formData.phone_number}
          onChange={handleChange('phone_number')}
          placeholder="+15551234567"
          required
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          required
        />
        <FormInput
          id="password_confirmation"
          label="Confirm Password"
          type="password"
          value={formData.password_confirmation}
          onChange={handleChange('password_confirmation')}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      {onSwitchToLogin && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-indigo-600 hover:underline">
              Login
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

SignupForm.propTypes = {
  onSwitchToLogin: PropTypes.func,
  onSignupSuccess: PropTypes.func,
  onLoginSuccess: PropTypes.func,
};

export default SignupForm;
