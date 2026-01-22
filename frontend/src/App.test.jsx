import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('should render home page with main heading', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const heading = screen.getByRole('heading', { level: 1, name: /get your auto loan in 15 minutes/i });
    expect(heading).toBeInTheDocument();
  });
});
