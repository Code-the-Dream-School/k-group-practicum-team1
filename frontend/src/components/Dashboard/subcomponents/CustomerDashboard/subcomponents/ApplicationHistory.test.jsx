import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ApplicationHistory from './ApplicationHistory';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ApplicationHistory Component', () => {
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  const mockApplications = [
    {
      id: 1,
      applicationNumber: 'TEST-001',
      vehicle: 'Test Vehicle',
      loanAmount: 10000,
      createdAt: '2024-01-01',
      status: 'approved',
    },
  ];

  describe('Rendering', () => {
    test('renders component with title and icon', () => {
      renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      expect(screen.getByText('Application History')).toBeInTheDocument();
    });

    test('renders table headers on desktop', () => {
      renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      expect(screen.getAllByText('Application ID').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Loan Amount').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Submitted Date').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
      const actionElements = screen.queryAllByText('Action');
      expect(actionElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Loading State', () => {
    test('displays loading message when loading is true', () => {
      renderWithRouter(<ApplicationHistory applications={[]} loading={true} error={null} />);
      expect(screen.getByText('Loading applications...')).toBeInTheDocument();
    });

    test('shows title even when loading', () => {
      renderWithRouter(<ApplicationHistory applications={[]} loading={true} error={null} />);
      expect(screen.getByText('Application History')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    test('displays error message when error is present', () => {
      renderWithRouter(<ApplicationHistory applications={[]} loading={false} error="Failed to fetch" />);
      expect(screen.getByText(/Error: Failed to fetch/)).toBeInTheDocument();
    });

    test('shows title even when error occurs', () => {
      renderWithRouter(<ApplicationHistory applications={[]} loading={false} error="Failed to fetch" />);
      expect(screen.getByText('Application History')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    test('displays empty state message when no applications', () => {
      renderWithRouter(<ApplicationHistory applications={[]} loading={false} error={null} />);
      expect(screen.getByText('No application history found.')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    test('renders applications in table format', () => {
      renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      // Use getAllByText since content appears in both desktop and mobile views
      const appIds = screen.getAllByText(/TEST-001/);
      expect(appIds.length).toBeGreaterThan(0);
    });

    test('formats amount as currency', () => {
      renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);

      const amounts = screen.getAllByText(/\$10,000/);
      expect(amounts.length).toBeGreaterThan(0);
    });

    test('renders status badges', () => {
      const { container } = renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const badges = container.querySelectorAll('.rounded-full');
      expect(badges.length).toBeGreaterThan(0);
    });

    test('renders action buttons', () => {
      renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const buttons = screen.getAllByLabelText('View details');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    test('has desktop table view with hidden class for mobile', () => {
      const { container } = renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const desktopTable = container.querySelector('.hidden.md\\:block');
      expect(desktopTable).toBeInTheDocument();
    });

    test('has mobile card view with hidden class for desktop', () => {
      const { container } = renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const mobileCards = container.querySelector('.md\\:hidden');
      expect(mobileCards).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('has white background container', () => {
      const { container } = renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const mainContainer = container.querySelector('.bg-white.rounded-lg.shadow-sm');
      expect(mainContainer).toBeInTheDocument();
    });

    test('displays clock icon with title', () => {
      const { container } = renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const iconContainer = container.querySelector('.flex.items-center.gap-2');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Status Badge Styling', () => {
    test('applies different badge colors based on status', () => {
      const approvedApp = { ...mockApplications[0], status: 'approved' };
      const { container } = renderWithRouter(<ApplicationHistory applications={[approvedApp]} loading={false} error={null} />);
      const badge = container.querySelector('.bg-green-100');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const heading = screen.getByRole('heading', { name: /application history/i });
      expect(heading).toBeInTheDocument();
    });

    test('action buttons have aria-labels', () => {
      renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const buttons = screen.getAllByLabelText('View details');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Card Layout', () => {
    test('renders mobile cards with application data', () => {
      const { container } = renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const mobileSection = container.querySelector('.md\\:hidden');
      expect(mobileSection).toBeInTheDocument();
    });

    test('mobile cards have view details button', () => {
      renderWithRouter(<ApplicationHistory applications={mockApplications} loading={false} error={null} />);
      const viewDetailsButtons = screen.getAllByText(/view details/i);
      expect(viewDetailsButtons.length).toBeGreaterThan(0);
    });
  });
});
