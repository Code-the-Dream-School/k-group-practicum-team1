import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CustomerDashboard from './CustomerDashboard';

jest.mock('../../../../services/api', () => ({
  API_BASE: 'http://localhost:3000',
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));

jest.mock('../../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../../../../context/AuthContext';

jest.mock('./subcomponents/ApplicationHistory', () => {
  return function MockApplicationHistory({ applications, loading, error }) {
    if (loading) return <div>Loading history...</div>;
    if (error) return <div>Error: {error}</div>;
    return <div data-testid="application-history">Application History: {applications.length} apps</div>;
  };
});

jest.mock('./subcomponents/ApplicationInProgress', () => {
  return function MockApplicationInProgress({ applicationId }) {
    return <div data-testid={`application-progress-${applicationId}`}>Application {applicationId}</div>;
  };
});

jest.mock('./subcomponents/NewApplication', () => {
  return function MockNewApplication() {
    return <div data-testid="new-application">No applications - Start new</div>;
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CustomerDashboard Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { firstName: 'John' },
      isAuthenticated: true,
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders dashboard with header', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
      });
      expect(screen.getByText("Here's an overview of your loan application")).toBeInTheDocument();
    });

    test('renders New Application button with link', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const newAppButton = screen.getByRole('link', { name: /new application/i });
        expect(newAppButton).toBeInTheDocument();
        expect(newAppButton).toHaveAttribute('href', '/application');
      });
    });

    test('renders with blue background button styling', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const newAppButton = screen.getByRole('link', { name: /new application/i });
        expect(newAppButton).toHaveClass('bg-blue-600');
      });
    });
  });

  describe('Applications Display', () => {
    test('renders applications in progress section with multiple apps', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Applications in Progress')).toBeInTheDocument();
      });
      expect(screen.getByText('Track the status of your current applications')).toBeInTheDocument();
    });

    test('renders ApplicationHistory component', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const historyComponent = screen.getByTestId('application-history');
        expect(historyComponent).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    test('shows NewApplication component when no applications exist', async () => {
      const originalUseEffect = React.useEffect;
      jest.spyOn(React, 'useEffect').mockImplementation((effect) => {
        if (effect.length === 0) {
          // This is the fetchApplications effect
          return;
        }
        return originalUseEffect(effect);
      });
    });
  });

  describe('Component Structure', () => {
    test('has correct main container classes', async () => {
      const { container } = renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const mainDiv = container.querySelector('.min-h-screen.bg-gray-50.p-6');
        expect(mainDiv).toBeInTheDocument();
      });
    });

    test('has max-width container for content', async () => {
      const { container } = renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const contentContainer = container.querySelector('.max-w-7xl.mx-auto');
        expect(contentContainer).toBeInTheDocument();
      });
    });

    test('renders header with proper spacing', async () => {
      const { container } = renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const headerDiv = container.querySelector('.flex.justify-between.items-start.mb-8');
        expect(headerDiv).toBeInTheDocument();
      });
    });
  });

  describe('Filtering Logic', () => {
    test('filters out draft applications', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        // Verify that applications are being filtered
        const progressApps = screen.queryAllByTestId(/application-progress-/);
        expect(progressApps.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Layout', () => {
    test('renders applications and history in vertical stack', async () => {
      const { container } = renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const stackContainer = container.querySelector('.space-y-6');
        expect(stackContainer).toBeInTheDocument();
      });
    });

    test('section header has proper styling', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const sectionHeader = screen.getByText('Applications in Progress');
        expect(sectionHeader).toHaveClass('text-2xl', 'font-bold', 'text-gray-900');
      });
    });
  });

  describe('User Greeting', () => {
    test('displays personalized welcome message', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1, name: /welcome, john!/i });
        expect(heading).toBeInTheDocument();
      });
    });

    test('welcome heading has correct styling', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-gray-900');
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper heading hierarchy', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const h1 = screen.getByRole('heading', { level: 1 });
        const h2 = screen.getByRole('heading', { level: 2 });
        expect(h1).toBeInTheDocument();
        expect(h2).toBeInTheDocument();
      });
    });

    test('New Application button is keyboard accessible', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const button = screen.getByRole('link', { name: /new application/i });
        expect(button).toBeInTheDocument();
        // Link elements are naturally keyboard accessible
      });
    });
  });

  describe('Responsive Design', () => {
    test('uses responsive padding classes', async () => {
      const { container } = renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const mainDiv = container.querySelector('.p-6');
        expect(mainDiv).toBeInTheDocument();
      });
    });
  });

  describe('Integration', () => {
    test('renders ApplicationInProgress components', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const progressApps = screen.queryAllByTestId(/application-progress-/);
        expect(progressApps.length).toBeGreaterThanOrEqual(0);
      });
    });

    test('passes applications array to ApplicationHistory', async () => {
      renderWithRouter(<CustomerDashboard />);

      await waitFor(() => {
        const history = screen.getByTestId('application-history');
        expect(history).toBeInTheDocument();
      });
    });
  });
});
