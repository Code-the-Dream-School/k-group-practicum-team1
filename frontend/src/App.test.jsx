import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';

jest.mock('./services/api', () => ({
  API_BASE:  process.env.VITE_API_URL,
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));

describe('App', () => {
  it('should render main heading section ', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );

    const mainHeading = screen.getByText(/Get Your Auto Loan in/i);
    expect(mainHeading).toBeInTheDocument();
  });
  it('should render benefits section', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );

    const benefitsHeading = screen.getByText(/Why Choose TurboLoan/i);
    expect(benefitsHeading).toBeInTheDocument();
  });

  it('should render loan calculator section', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );

    const calculatorHeading = screen.getByText(/Calculate your loan/i);
    expect(calculatorHeading).toBeInTheDocument();
  });
});
