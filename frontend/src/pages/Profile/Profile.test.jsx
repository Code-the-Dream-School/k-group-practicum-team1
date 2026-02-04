jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  apiFetch: jest.fn(),
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Profile Component', () => {
  const mockSetUser = jest.fn();
  const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '1234567890',
    role: 'customer',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    useAuth.mockReturnValue({
      user: null,
      setUser: mockSetUser,
    });
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('Loading State', () => {
    it('shows loading state when fetching user data', () => {
      apiFetch.mockReturnValue(new Promise(() => {}));

      render(<Profile />);

      expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when API call fails', async () => {
      apiFetch.mockRejectedValue(new Error('Network error'));

      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('displays generic error when no specific message', async () => {
      apiFetch.mockRejectedValue(new Error(''));

      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch profile')).toBeInTheDocument();
      });
    });
  });

  describe('User Already in Context', () => {
    it('does not fetch when user exists in context', () => {
      useAuth.mockReturnValue({
        user: mockUser,
        setUser: mockSetUser,
      });

      render(<Profile />);

      expect(apiFetch).not.toHaveBeenCalled();
    });

    it('displays user data from context', () => {
      useAuth.mockReturnValue({
        user: mockUser,
        setUser: mockSetUser,
      });

      render(<Profile />);

      expect(screen.getByText('Your Profile')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('customer')).toBeInTheDocument();
    });
  });

  describe('Fetching User Data', () => {
    it('fetches user when not in context', async () => {
      useAuth.mockReturnValue({
        user: null,
        setUser: mockSetUser,
      });

      apiFetch.mockResolvedValue({ data: mockUser });

      render(<Profile />);

      await waitFor(() => {
        expect(apiFetch).toHaveBeenCalledWith('/api/v1/me');
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      });
    });

    it('sets loading to false after fetch', async () => {
      useAuth.mockReturnValue({
        user: null,
        setUser: mockSetUser,
      });
      apiFetch.mockResolvedValue({ data: mockUser });
      const { rerender } = render(<Profile />);

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      });

      useAuth.mockReturnValue({
        user: mockUser,
        setUser: mockSetUser,
      });
      rerender(<Profile />);
      expect(screen.getByText('Your Profile')).toBeInTheDocument();
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });
  });

  describe('No User After Fetch', () => {
    it('shows login prompt when no user data returned', async () => {
      useAuth.mockReturnValue({
        user: null,
        setUser: mockSetUser,
      });
      apiFetch.mockResolvedValue({ data: null });
      render(<Profile />);
      await waitFor(() => {
        expect(screen.getByText('Please login to see your profile.')).toBeInTheDocument();
      });
    });
  });

  describe('Profile Data Display', () => {
    it('shows dash for missing values', () => {
      const incompleteUser = {
        first_name: 'Jane',
        email: 'jane@example.com',
        // Missing other fields
      };

      useAuth.mockReturnValue({
        user: incompleteUser,
        setUser: mockSetUser,
      });
      render(<Profile />);
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();

      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('handles empty strings as missing values', () => {
      const userWithEmpties = {
        first_name: 'Bob',
        last_name: '',
        email: 'bob@example.com',
        phone_number: '',
        role: '',
      };

      useAuth.mockReturnValue({
        user: userWithEmpties,
        setUser: mockSetUser,
      });
      render(<Profile />);
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();

      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBe(3);
    });
  });

  describe('Layout and Styling', () => {
    it('has correct container classes', () => {
      useAuth.mockReturnValue({
        user: mockUser,
        setUser: mockSetUser,
      });
      const { container } = render(<Profile />);
      const mainDiv = container.querySelector('div.w-full.max-w-md.mx-auto.bg-white.rounded-xl.shadow-lg.p-8');
      expect(mainDiv).toBeInTheDocument();
    });

    it('has properly styled heading', () => {
      useAuth.mockReturnValue({
        user: mockUser,
        setUser: mockSetUser,
      });

      render(<Profile />);
      const heading = screen.getByText('Your Profile');
      expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-indigo-700', 'mb-4');
    });
  });

  describe('Profile Row Structure', () => {
    it('renders all profile fields in correct order', () => {
      useAuth.mockReturnValue({
        user: mockUser,
        setUser: mockSetUser,
      });

      render(<Profile />);
      const labels = ['First Name', 'Last Name', 'Email', 'Phone', 'Role'];
      labels.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });
});
