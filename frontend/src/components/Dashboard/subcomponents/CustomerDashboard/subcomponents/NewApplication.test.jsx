import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import NewApplication from './NewApplication';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NewApplication Component', () => {
  describe('Rendering', () => {
    test('renders component with empty state message', () => {
      renderWithRouter(<NewApplication />);
      expect(screen.getByText('No Pending Applications')).toBeInTheDocument();
    });

    test('displays descriptive text', () => {
      renderWithRouter(<NewApplication />);
      expect(screen.getByText(/don't have any applications pending review/i)).toBeInTheDocument();
    });

    test('renders call-to-action button', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Icon Display', () => {
    test('renders inbox icon container', () => {
      const { container } = renderWithRouter(<NewApplication />);
      const iconContainer = container.querySelector('.inline-flex.items-center.justify-center');
      expect(iconContainer).toBeInTheDocument();
    });

    test('icon container has circular background', () => {
      const { container } = renderWithRouter(<NewApplication />);
      const iconContainer = container.querySelector('.rounded-full.bg-gray-100');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Button Functionality', () => {
    test('button links to new application page', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toHaveAttribute('href', '/application');
    });

    test('button has proper styling', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toHaveClass('bg-blue-600', 'text-white', 'rounded-lg');
    });

    test('button has hover state styling', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toHaveClass('hover:bg-blue-700');
    });

    test('button includes plus icon', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('has white background container', () => {
      const { container } = renderWithRouter(<NewApplication />);
      const mainContainer = container.querySelector('.bg-white.rounded-lg.shadow-sm');
      expect(mainContainer).toBeInTheDocument();
    });

    test('content is center-aligned', () => {
      const { container } = renderWithRouter(<NewApplication />);
      const centerContainer = container.querySelector('.text-center');
      expect(centerContainer).toBeInTheDocument();
    });

    test('has proper padding', () => {
      const { container } = renderWithRouter(<NewApplication />);
      const mainContainer = container.querySelector('.p-12');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Typography', () => {
    test('heading has proper styling', () => {
      renderWithRouter(<NewApplication />);
      const heading = screen.getByText('No Pending Applications');
      expect(heading).toHaveClass('text-2xl', 'font-semibold', 'text-gray-900');
    });

    test('description text has gray color', () => {
      renderWithRouter(<NewApplication />);
      const description = screen.getByText(/don't have any applications pending review/i);
      expect(description).toHaveClass('text-gray-600');
    });
  });

  describe('Layout Spacing', () => {
    test('icon has bottom margin', () => {
      const { container } = renderWithRouter(<NewApplication />);
      const iconContainer = container.querySelector('.mb-6');
      expect(iconContainer).toBeInTheDocument();
    });

    test('heading has bottom margin', () => {
      renderWithRouter(<NewApplication />);
      const heading = screen.getByText('No Pending Applications');
      expect(heading).toHaveClass('mb-3');
    });

    test('description has bottom margin', () => {
      renderWithRouter(<NewApplication />);
      const description = screen.getByText(/don't have any applications pending review/i);
      expect(description).toHaveClass('mb-8');
    });
  });

  describe('Accessibility', () => {
    test('has proper heading level', () => {
      renderWithRouter(<NewApplication />);
      const heading = screen.getByRole('heading', { level: 3, name: /no pending applications/i });
      expect(heading).toBeInTheDocument();
    });

    test('button is keyboard accessible', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toBeInTheDocument();
    });

    test('description text is within max-width for readability', () => {
      renderWithRouter(<NewApplication />);
      const description = screen.getByText(/don't have any applications pending review/i);
      expect(description).toHaveClass('max-w-md', 'mx-auto');
    });
  });

  describe('Visual Design', () => {
    test('icon container has proper size', () => {
      const { container } = renderWithRouter(<NewApplication />);
      const iconContainer = container.querySelector('.w-24.h-24');
      expect(iconContainer).toBeInTheDocument();
    });

    test('button has transition effect', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toHaveClass('transition-colors');
    });

    test('button has shadow', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toHaveClass('shadow-sm');
    });
  });

  describe('Button Content', () => {
    test('button displays inline flex layout', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toHaveClass('inline-flex', 'items-center');
    });

    test('button has proper padding', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toHaveClass('px-8', 'py-3');
    });

    test('button has font weight', () => {
      renderWithRouter(<NewApplication />);
      const button = screen.getByRole('link', { name: /start a new application/i });
      expect(button).toHaveClass('font-medium');
    });
  });
});
