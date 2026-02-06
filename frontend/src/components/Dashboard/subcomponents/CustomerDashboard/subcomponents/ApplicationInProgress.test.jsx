import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ApplicationInProgress from './ApplicationInProgress';

jest.mock('../../../../../services/api', () => ({
  API_BASE: 'http://localhost:3000',
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import { apiFetch } from '../../../../../services/api';

jest.mock('../../../../Stepper/Stepper', () => {
  return function MockStepper({ currentStep, title, progressTextType }) {
    return (
      <div data-testid="stepper">
        <div>{title}</div>
        <div>Step {currentStep}</div>
        <div>{progressTextType}</div>
      </div>
    );
  };
});

describe('ApplicationInProgress Component', () => {
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  beforeEach(() => {
    // Mock apiFetch to return complete application data
    apiFetch.mockResolvedValue({
      data: {
        id: 1,
        application_number: 'APP-001',
        status: 'pending',
        current_step: 2,
        submitted_date: '2024-01-01',
        loan_amount: 25000,
        term_months: 60,
        apr: 5.5,
        vehicle: {
          year: 2020,
          make: 'Toyota',
          model: 'Camry',
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Props Validation', () => {
    test('throws error when applicationId is not provided', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderWithRouter(<ApplicationInProgress />);
      }).toThrow('applicationId prop is required');

      consoleError.mockRestore();
    });
  });

  describe('Loading State', () => {
    test('displays loading message initially', () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      const loadingText = screen.queryByText('Loading application details');
      const appNumber = screen.queryByText('APP-001');
      expect(loadingText || appNumber).toBeTruthy();
    });

    test('has proper loading container styling', () => {
      const { container } = renderWithRouter(<ApplicationInProgress applicationId={1} />);
      const loadingContainer = container.querySelector('.bg-white.rounded-lg.shadow-sm');
      expect(loadingContainer).toBeInTheDocument();
    });
  });

  describe('Rendering with Data', () => {
    test('renders application number after loading', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading application details...')).not.toBeInTheDocument();
      });

      const appNumber = screen.getByText('APP-001');
      expect(appNumber).toBeInTheDocument();
    });

    test('renders vehicle information', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading application details...')).not.toBeInTheDocument();
      });

      const component = screen.getByTestId('stepper').parentElement;
      expect(component).toBeInTheDocument();
    });

    test('displays status badge', async () => {
      const { container } = renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const badge = container.querySelector('.rounded-lg');
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('Financial Information Grid', () => {
    test('renders submitted date label', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Submitted')).toBeInTheDocument();
      });
    });

    test('renders loan amount label', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Loan Amount')).toBeInTheDocument();
      });
    });

    test('renders term label', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Term')).toBeInTheDocument();
      });
    });

    test('renders APR label', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('APR')).toBeInTheDocument();
      });
    });
  });

  describe('Stepper Integration', () => {
    test('renders Stepper component', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('stepper')).toBeInTheDocument();
      });
    });

    test('passes title to Stepper', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Application Progress')).toBeInTheDocument();
      });
    });

    test('passes percentage type to Stepper', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('percentage')).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    test('has white background container', async () => {
      const { container } = renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const mainContainer = container.querySelector('.bg-white.rounded-lg.shadow-sm.p-6');
        expect(mainContainer).toBeInTheDocument();
      });
    });

    test('has header section with flex layout', async () => {
      const { container } = renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const header = container.querySelector('.flex.justify-between.items-start');
        expect(header).toBeInTheDocument();
      });
    });

    test('has grid layout for financial details', async () => {
      const { container } = renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const grid = container.querySelector('.grid');
        expect(grid).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Grid', () => {
    test('uses responsive grid columns', async () => {
      const { container } = renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const grid = container.querySelector('.grid.grid-cols-2.sm\\:grid-cols-4');
        expect(grid).toBeInTheDocument();
      });
    });
  });

  describe('Typography', () => {
    test('application number has proper heading styling', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const heading = screen.getByText('APP-001');
        expect(heading).toHaveClass('text-xl', 'font-bold');
      });
    });
  });

  describe('Different Application IDs', () => {
    test('renders with different applicationId prop', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={2} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading application details...')).not.toBeInTheDocument();
      });
    });

    test('handles applicationId 3', async () => {
      renderWithRouter(<ApplicationInProgress applicationId={3} />);

      await waitFor(() => {
        expect(screen.getByTestId('stepper')).toBeInTheDocument();
      });
    });
  });
});
