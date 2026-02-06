import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewApplicationPage from './NewApplicationPage';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

jest.mock('../../stores/loanApplicationStore');
jest.mock('../../services/api', () => ({
  API_BASE: 'http://localhost:3000',
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));

jest.mock('../../components/Stepper/Stepper', () => {
  return function MockStepper({ steps, currentStep, title, progressTextType, onStepClick }) {
    return (
      <div data-testid="stepper">
        <div data-testid="stepper-title">{title}</div>
        <div data-testid="stepper-current-step">{currentStep}</div>
        <div data-testid="stepper-progress-type">{progressTextType}</div>
        <div data-testid="stepper-total-steps">{steps.length}</div>
        {steps.map((step, index) => (
          <button key={index} onClick={() => onStepClick(index + 1)} data-testid={`step-${index + 1}`}>
            {step.label}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/LoanApplication/PersonalInformation', () => {
  return function MockPersonalInformation() {
    return <div data-testid="personal-information">Personal Information Form</div>;
  };
});

describe('NewApplicationPage', () => {
  let mockClearDraft;
  let mockGoToStep;

  beforeEach(() => {
    mockClearDraft = jest.fn();
    mockGoToStep = jest.fn();

    useLoanApplicationStore.mockReturnValue({
      currentStep: 1,
      goToStep: mockGoToStep,
      clearDraft: mockClearDraft,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page with title and description', () => {
    render(<NewApplicationPage />);

    expect(screen.getByText('Auto Loan Application')).toBeInTheDocument();
    expect(screen.getByText('Complete the form below to apply for an auto loan')).toBeInTheDocument();
  });

  it('should call clearDraft on component mount', () => {
    render(<NewApplicationPage />);

    expect(mockClearDraft).toHaveBeenCalledTimes(1);
  });

  it('should render Stepper with correct props', () => {
    render(<NewApplicationPage />);

    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByTestId('stepper-title')).toHaveTextContent('Application Progress');
    expect(screen.getByTestId('stepper-current-step')).toHaveTextContent('1');
    expect(screen.getByTestId('stepper-progress-type')).toHaveTextContent('step');
    expect(screen.getByTestId('stepper-total-steps')).toHaveTextContent('5');
  });

  it('should render all step labels in the Stepper', () => {
    render(<NewApplicationPage />);

    const expectedSteps = [
      'Personal Details',
      'Vehicle Details',
      'Financial Information',
      'Loan Details',
      'Review & Submit',
    ];

    expectedSteps.forEach((stepLabel) => {
      expect(screen.getByText(stepLabel)).toBeInTheDocument();
    });
  });

  it('should render PersonalInformation component for step 1', () => {
    useLoanApplicationStore.mockReturnValue({
      currentStep: 1,
      goToStep: mockGoToStep,
      clearDraft: mockClearDraft,
    });

    render(<NewApplicationPage />);

    expect(screen.getByTestId('personal-information')).toBeInTheDocument();
  });

  it('should call goToStep when a step is clicked in Stepper', () => {
    render(<NewApplicationPage />);

    const step2Button = screen.getByTestId('step-2');
    fireEvent.click(step2Button);

    expect(mockGoToStep).toHaveBeenCalledWith(2);
  });

  it('should render PersonalInformation for invalid step number (default case)', () => {
    useLoanApplicationStore.mockReturnValue({
      currentStep: 99,
      goToStep: mockGoToStep,
      clearDraft: mockClearDraft,
    });

    render(<NewApplicationPage />);

    expect(screen.getByTestId('personal-information')).toBeInTheDocument();
  });
});
