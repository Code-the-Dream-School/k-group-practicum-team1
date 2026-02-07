import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NewApplicationPage from './NewApplicationPage';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

jest.mock('../../stores/loanApplicationStore');
jest.mock('../../services/api', () => ({
  API_BASE: 'http://localhost:3000',
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
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
  let mockLoadDraftFromServer;
  let mockNavigate;

  beforeEach(() => {
    mockClearDraft = jest.fn();
    mockGoToStep = jest.fn();
    mockLoadDraftFromServer = jest.fn();
    mockNavigate = jest.fn();

    const { useNavigate, useParams } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({});

    useLoanApplicationStore.mockReturnValue({
      currentStep: 1,
      goToStep: mockGoToStep,
      clearDraft: mockClearDraft,
      loadDraftFromServer: mockLoadDraftFromServer,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page with title and description', () => {
    render(
      <MemoryRouter>
        <NewApplicationPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Auto Loan Application')).toBeInTheDocument();
    expect(screen.getByText('Complete the form below to apply for an auto loan')).toBeInTheDocument();
  });

  it('should call clearDraft on component mount', () => {
    render(
      <MemoryRouter>
        <NewApplicationPage />
      </MemoryRouter>
    );

    expect(mockClearDraft).toHaveBeenCalledTimes(1);
  });

  it('should render Stepper with correct props', () => {
    render(
      <MemoryRouter>
        <NewApplicationPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByTestId('stepper-title')).toHaveTextContent('Application Progress');
    expect(screen.getByTestId('stepper-current-step')).toHaveTextContent('1');
    expect(screen.getByTestId('stepper-progress-type')).toHaveTextContent('step');
    expect(screen.getByTestId('stepper-total-steps')).toHaveTextContent('5');
  });

  it('should render all step labels in the Stepper', () => {
    render(
      <MemoryRouter>
        <NewApplicationPage />
      </MemoryRouter>
    );

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
      loadDraftFromServer: mockLoadDraftFromServer,
    });

    render(
      <MemoryRouter>
        <NewApplicationPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('personal-information')).toBeInTheDocument();
  });

  it('should call goToStep when a step is clicked in Stepper', () => {
    render(
      <MemoryRouter>
        <NewApplicationPage />
      </MemoryRouter>
    );

    const step2Button = screen.getByTestId('step-2');
    fireEvent.click(step2Button);

    expect(mockGoToStep).toHaveBeenCalledWith(2);
  });

  it('should render PersonalInformation for invalid step number (default case)', () => {
    useLoanApplicationStore.mockReturnValue({
      currentStep: 99,
      goToStep: mockGoToStep,
      clearDraft: mockClearDraft,
      loadDraftFromServer: mockLoadDraftFromServer,
    });

    render(
      <MemoryRouter>
        <NewApplicationPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('personal-information')).toBeInTheDocument();
  });
});
