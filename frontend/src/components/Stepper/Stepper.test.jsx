/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stepper from './Stepper';

describe('Stepper Component', () => {
  const defaultSteps = [
    { label: 'Personal' },
    { label: 'Vehicle Details' },
    { label: 'Financial' },
    { label: 'Terms' },
    { label: 'Documents' },
  ];

  describe('Rendering the Stepper component', () => {
    test('renders with default props', () => {
      render(<Stepper steps={defaultSteps} />);
      expect(screen.getByText('Application Progress')).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    });

    test('renders all step labels', () => {
      render(<Stepper steps={defaultSteps} currentStep={1} />);
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('Vehicle Details')).toBeInTheDocument();
      expect(screen.getByText('Financial')).toBeInTheDocument();
      expect(screen.getByText('Terms')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    test('renders custom title', () => {
      render(<Stepper steps={defaultSteps} title="Progress" />);
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    test('throws error with empty steps array', () => {
      expect(() => render(<Stepper steps={[]} />)).toThrow();
    });
  });

  describe('Progress Bar Step/Percentage text on Stepper', () => {
    test('displays step format by default', () => {
      render(<Stepper steps={defaultSteps} currentStep={2} />);
      expect(screen.getByText('Step 2 of 5')).toBeInTheDocument();
    });

    test('displays percentage format when progressTextType is "percentage"', () => {
      render(<Stepper steps={defaultSteps} currentStep={2} progressTextType="percentage" />);
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    test('displays 0% when currentStep is 0 in percentage mode', () => {
      render(<Stepper steps={defaultSteps} currentStep={0} progressTextType="percentage" />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    test('displays 100% when currentStep equals total steps in percentage mode', () => {
      render(<Stepper steps={defaultSteps} currentStep={5} progressTextType="percentage" />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    test('displays 60% when currentStep is 3 out of 5 in percentage mode', () => {
      render(<Stepper steps={defaultSteps} currentStep={3} progressTextType="percentage" />);
      expect(screen.getByText('60%')).toBeInTheDocument();
    });
  });

  describe('Progress Bar for Stepper component', () => {
    test('progress bar width is correct for step 1 of 5 (20%)', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={1} />);
      const progressBar = container.querySelector('.bg-blue-600.h-2\\.5');
      expect(progressBar).toHaveStyle({ width: '20%' });
    });

    test('progress bar width is correct for step 3 of 5 (60%)', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={3} />);
      const progressBar = container.querySelector('.bg-blue-600.h-2\\.5');
      expect(progressBar).toHaveStyle({ width: '60%' });
    });

    test('progress bar width is 100% when at last step', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={5} />);
      const progressBar = container.querySelector('.bg-blue-600.h-2\\.5');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    test('progress bar width is capped at 100% even if currentStep exceeds total', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={10} />);
      const progressBar = container.querySelector('.bg-blue-600.h-2\\.5');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    test('progress bar width is at least 0% even if currentStep is negative', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={-1} />);
      const progressBar = container.querySelector('.bg-blue-600.h-2\\.5');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });
  });

  describe('Step States for Stepper component', () => {
    test('current step has blue background by default', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={2} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[1]).toHaveClass('bg-blue-600');
    });

    test('completed steps have blue background by default', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={3} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[0]).toHaveClass('bg-blue-600'); // Step 1 is completed
      expect(stepCircles[1]).toHaveClass('bg-blue-600'); // Step 2 is completed
    });

    test('future steps have slate background by default', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={2} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[2]).toHaveClass('bg-slate-500'); // Step 3 is future
      expect(stepCircles[3]).toHaveClass('bg-slate-500'); // Step 4 is future
      expect(stepCircles[4]).toHaveClass('bg-slate-500'); // Step 5 is future
    });
  });

  describe('Step Numbers for Stepper component', () => {
    test('displays step numbers when no icon is provided', () => {
      render(<Stepper steps={defaultSteps} currentStep={1} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Custom Icons for Stepper component', () => {
    test('displays custom icon when provided', () => {
      const stepsWithIcon = [
        { label: 'Personal', icon: <span data-testid="custom-icon">Custom Icon</span> },
        { label: 'Vehicle' },
      ];
      render(<Stepper steps={stepsWithIcon} currentStep={1} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Custom Background Colors for Stepper component', () => {
    test('applies custom Tailwind bgColor when provided', () => {
      const stepsWithColor = [{ label: 'Personal', bgColor: 'bg-purple-600' }, { label: 'Vehicle' }];
      const { container } = render(<Stepper steps={stepsWithColor} currentStep={1} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[0]).toHaveClass('bg-purple-600');
    });

    test('applies custom hex bgColor when provided', () => {
      const stepsWithColor = [{ label: 'Personal', bgColor: '#8B5CF6' }, { label: 'Vehicle' }];
      const { container } = render(<Stepper steps={stepsWithColor} currentStep={1} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[0]).toHaveStyle({ backgroundColor: '#8B5CF6' });
    });

    test('uses default color when bgColor is not provided', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={1} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[0]).toHaveClass('bg-blue-600'); // Active step
      expect(stepCircles[1]).toHaveClass('bg-slate-500'); // Future step
    });
  });

  describe('Custom Text Colors', () => {
    test('applies custom textColor when provided', () => {
      const stepsWithTextColor = [{ label: 'Personal', textColor: 'text-red-600' }, { label: 'Vehicle' }];
      const { container } = render(<Stepper steps={stepsWithTextColor} currentStep={1} />);
      const labels = container.querySelectorAll('.text-xs.text-center.font-medium');
      expect(labels[0]).toHaveClass('text-red-600');
    });

    test('uses default text color when textColor is not provided', () => {
      const { container } = render(<Stepper steps={defaultSteps} currentStep={1} />);
      const labels = container.querySelectorAll('.text-xs.text-center.font-medium');
      expect(labels[0]).toHaveClass('text-gray-800');
    });

    test('applies custom textColor for completedConfig when provided', () => {
      const completedConfig = { textColor: 'text-yellow-600' };
      const { container } = render(<Stepper steps={defaultSteps} currentStep={3} completedConfig={completedConfig} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[0]).toHaveClass('text-yellow-600');
      expect(stepCircles[1]).toHaveClass('text-yellow-600');
    });

    test('applies custom bgColor for completedConfig when provided', () => {
      const completedConfig = { bgColor: 'bg-yellow-600' };
      const { container } = render(<Stepper steps={defaultSteps} currentStep={3} completedConfig={completedConfig} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[0]).toHaveClass('bg-yellow-600');
      expect(stepCircles[1]).toHaveClass('bg-yellow-600');
    });

    test('applies both custom bgColor and textColor for completedConfig when provided', () => {
      const completedConfig = { bgColor: 'bg-yellow-600', textColor: 'text-black' };
      const { container } = render(<Stepper steps={defaultSteps} currentStep={3} completedConfig={completedConfig} />);
      const stepCircles = container.querySelectorAll('.rounded-full.w-8.h-8');
      expect(stepCircles[0]).toHaveClass('bg-yellow-600');
      expect(stepCircles[0]).toHaveClass('text-black');
      expect(stepCircles[1]).toHaveClass('bg-yellow-600');
      expect(stepCircles[1]).toHaveClass('text-black');
    });
  });
});
