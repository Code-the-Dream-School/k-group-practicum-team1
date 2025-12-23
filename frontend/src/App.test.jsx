import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render h1 with Auto Loan Application System', () => {
    render(<App />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Auto Loan Application System');
  });
});
