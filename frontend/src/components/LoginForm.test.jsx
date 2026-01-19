// frontend/src/components/LoginForm.test.jsx
import React from 'react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../services/auth', () => ({
  login: jest.fn(),
}));

const { useAuth } = require('../context/AuthContext');
const { login } = require('../services/auth');

describe('LoginForm', () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ setUser: mockSetUser });
  });

  it('renders login form with email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders heading with Auto Loan text', () => {
    render(<LoginForm />);
    expect(screen.getByText('Auto Loan')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('shows sign up link when onSwitchToSignup provided', () => {
    const mockSwitch = jest.fn();
    render(<LoginForm onSwitchToSignup={mockSwitch} />);
    fireEvent.click(screen.getByText(/sign up/i));
    expect(mockSwitch).toHaveBeenCalled();
  });

  it('submits form with email and password', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    login.mockResolvedValue(mockUser);
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    expect(mockSetUser).toHaveBeenCalledWith(mockUser);
  });

  it('calls onLoginSuccess callback when provided', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockOnLoginSuccess = jest.fn();
    login.mockResolvedValue(mockUser);

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('displays error message on login failure', async () => {
    login.mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });
  });

  it('displays fallback error when non-Error is thrown', async () => {
    login.mockRejectedValue('string error');

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Login failed');
    });
  });
});
