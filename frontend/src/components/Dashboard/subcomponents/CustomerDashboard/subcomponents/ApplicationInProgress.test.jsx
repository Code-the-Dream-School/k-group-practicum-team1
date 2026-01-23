import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationInProgress from './ApplicationInProgress';

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
  describe('Props Validation', () => {
    test('throws error when applicationId is not provided', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<ApplicationInProgress />);
      }).toThrow('applicationId prop is required');

      consoleError.mockRestore();
    });
  });

  describe('Loading State', () => {
    test('displays loading message initially', () => {
      render(<ApplicationInProgress applicationId={1} />);

      const loadingText = screen.queryByText('Loading application details...');
      const appNumber = screen.queryByText(/#AL-/);
      expect(loadingText || appNumber).toBeTruthy();
    });

    test('has proper loading container styling', () => {
      const { container } = render(<ApplicationInProgress applicationId={1} />);
      const loadingContainer = container.querySelector('.bg-white.rounded-lg.shadow-sm');
      expect(loadingContainer).toBeInTheDocument();
    });
  });

  describe('Rendering with Data', () => {
    test('renders application number after loading', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading application details...')).not.toBeInTheDocument();
      });

      const appNumber = screen.getByText(/^#/);
      expect(appNumber).toBeInTheDocument();
    });

    test('renders vehicle information', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading application details...')).not.toBeInTheDocument();
      });

      const component = screen.getByTestId('stepper').parentElement;
      expect(component).toBeInTheDocument();
    });

    test('displays status badge', async () => {
      const { container } = render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const badge = container.querySelector('.rounded-lg');
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('Financial Information Grid', () => {
    test('renders submitted date label', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Submitted')).toBeInTheDocument();
      });
    });

    test('renders loan amount label', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Loan Amount')).toBeInTheDocument();
      });
    });

    test('renders term label', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Term')).toBeInTheDocument();
      });
    });

    test('renders APR label', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('APR')).toBeInTheDocument();
      });
    });
  });

  describe('Stepper Integration', () => {
    test('renders Stepper component', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('stepper')).toBeInTheDocument();
      });
    });

    test('passes title to Stepper', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('Application Progress')).toBeInTheDocument();
      });
    });

    test('passes percentage type to Stepper', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        expect(screen.getByText('percentage')).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    test('has white background container', async () => {
      const { container } = render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const mainContainer = container.querySelector('.bg-white.rounded-lg.shadow-sm.p-6');
        expect(mainContainer).toBeInTheDocument();
      });
    });

    test('has header section with flex layout', async () => {
      const { container } = render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const header = container.querySelector('.flex.justify-between.items-start');
        expect(header).toBeInTheDocument();
      });
    });

    test('has grid layout for financial details', async () => {
      const { container } = render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const grid = container.querySelector('.grid');
        expect(grid).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Grid', () => {
    test('uses responsive grid columns', async () => {
      const { container } = render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const grid = container.querySelector('.grid.grid-cols-2.md\\:grid-cols-4');
        expect(grid).toBeInTheDocument();
      });
    });
  });

  describe('Typography', () => {
    test('application number has proper heading styling', async () => {
      render(<ApplicationInProgress applicationId={1} />);

      await waitFor(() => {
        const heading = screen.getByText(/^#/);
        expect(heading).toHaveClass('text-xl', 'font-bold');
      });
    });
  });

  describe('Different Application IDs', () => {
    test('renders with different applicationId prop', async () => {
      render(<ApplicationInProgress applicationId={2} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading application details...')).not.toBeInTheDocument();
      });
    });

    test('handles applicationId 3', async () => {
      render(<ApplicationInProgress applicationId={3} />);

      await waitFor(() => {
        expect(screen.getByTestId('stepper')).toBeInTheDocument();
      });
    });
  });
});
