import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
  it('should render main heading section ', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const mainHeading = screen.getByText(/Get Your Auto Loan in/i);
    expect(mainHeading).toBeInTheDocument();
  });
  it('should render benefits section', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const benefitsHeading = screen.getByText(/Why Choose TurboLoan/i);
    expect(benefitsHeading).toBeInTheDocument();
  });

  it('should render loan calculator section', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const calculatorHeading = screen.getByText(/Calculate your loan/i);
    expect(calculatorHeading).toBeInTheDocument();
  });
});
