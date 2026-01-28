// frontend/src/components/SignupForm.test.jsx
import React from 'react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from './SignupForm';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../services/auth', () => ({
  signup: jest.fn(),
  login: jest.fn(),
}));

const { useAuth } = require('../context/AuthContext');
const { signup, login } = require('../services/auth');

describe('SignupForm', () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ setUser: mockSetUser });
  });

  it('renders signup form with all required fields', () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders heading with Turbo Loan text', () => {
    render(<SignupForm />);
    expect(screen.getByText('Turbo Loan')).toBeInTheDocument();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('does not render role selector (security: users cannot self-assign privileged roles)', () => {
    render(<SignupForm />);
    expect(screen.queryByLabelText(/role/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('shows login link when onSwitchToLogin provided', () => {
    const mockSwitch = jest.fn();
    render(<SignupForm onSwitchToLogin={mockSwitch} />);
    fireEvent.click(screen.getByText(/login/i));
    expect(mockSwitch).toHaveBeenCalled();
  });

  it('shows error when passwords do not match', async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+15551234567' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match');
    });
    expect(signup).not.toHaveBeenCalled();
  });

  it('submits form with default customer role (security: prevents privilege escalation)', async () => {
    const mockUser = { id: 1, email: 'new@example.com' };
    signup.mockResolvedValue(mockUser);
    login.mockResolvedValue(mockUser);

    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+15551234567' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '+15551234567',
        email: 'new@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        role: 'customer',
      });
    });
    expect(mockSetUser).toHaveBeenCalledWith(mockUser);
  });

  it('calls onSignupSuccess callback when provided', async () => {
    const mockUser = { id: 1, email: 'new@example.com' };
    const mockOnSignupSuccess = jest.fn();
    signup.mockResolvedValue(mockUser);
    login.mockResolvedValue(mockUser);

    render(<SignupForm onSignupSuccess={mockOnSignupSuccess} />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+15551234567' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockOnSignupSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('displays error message on signup failure', async () => {
    signup.mockRejectedValue(new Error('Email already taken'));

    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+15551234567' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email already taken');
    });
  });

  it('displays fallback error when non-Error is thrown', async () => {
    signup.mockRejectedValue('string error');

    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+15551234567' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Signup failed');
    });
  });
});
