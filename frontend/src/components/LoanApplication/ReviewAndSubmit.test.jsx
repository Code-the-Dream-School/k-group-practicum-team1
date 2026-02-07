import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import ReviewAndSubmit from './ReviewAndSubmit';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

// Mock dependencies
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
}));

// Mock window.alert
global.alert = jest.fn();

describe('ReviewAndSubmit', () => {
  const mockNavigate = jest.fn();
  const mockPreviousStep = jest.fn();
  const mockClearDraft = jest.fn();
  const mockSaveDraftToServer = jest.fn();

  const mockDraft = {
    personalInfoAttributes: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      dob: '1990-01-15',
      ssn: '123456789',
    },
    addressesAttributes: [
      {
        addressStreet: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      },
    ],
    vehicleAttributes: {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      vin: '1HGBH41JXMN109186',
      mileage: 25000,
      vehicleType: 'new',
    },
    financialInfoAttributes: {
      employmentStatus: 'employed',
      employer: 'Tech Corp',
      jobTitle: 'Software Engineer',
      yearsEmployed: 5,
      annualIncome: 80000,
      monthlyExpenses: 2000,
    },
    purchasePrice: 30000,
    downPayment: 5000,
    loanAmount: 25000,
    termMonths: 60,
    apr: 4.5,
    monthlyPayment: 500,
    documents: [
      { document_name: 'Driver License', file_name: 'license.pdf' },
      { document_name: 'Pay Stub', file_name: 'paystub.pdf' },
    ],
    documentsAttributes: [
      { document_name: 'Driver License', file_name: 'license.pdf' },
      { document_name: 'Pay Stub', file_name: 'paystub.pdf' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSaveDraftToServer.mockResolvedValue({ success: true });
    useNavigate.mockReturnValue(mockNavigate);
    useLoanApplicationStore.mockReturnValue({
      draft: mockDraft,
      previousStep: mockPreviousStep,
      clearDraft: mockClearDraft,
      saveDraftToServer: mockSaveDraftToServer,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ReviewAndSubmit />
      </BrowserRouter>
    );
  };

  test('renders review and submit page with all sections', () => {
    renderComponent();

    expect(screen.getByText('Review & Submit')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Vehicle Information')).toBeInTheDocument();
    expect(screen.getByText('Financial Information')).toBeInTheDocument();
    expect(screen.getByText('Loan Details')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  test('displays personal information correctly', () => {
    renderComponent();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();
    expect(screen.getByText('***-**-6789')).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
  });

  test('displays vehicle information correctly', () => {
    renderComponent();

    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Camry')).toBeInTheDocument();
    expect(screen.getByText('1HGBH41JXMN109186')).toBeInTheDocument();
    expect(screen.getByText('25,000 miles')).toBeInTheDocument();
  });

  test('displays financial information correctly', () => {
    renderComponent();

    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('$80,000.00')).toBeInTheDocument();
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
  });

  test('displays loan details correctly', () => {
    renderComponent();

    expect(screen.getByText('$30,000.00')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('$25,000.00')).toBeInTheDocument();
    expect(screen.getByText('60 months')).toBeInTheDocument();
    expect(screen.getByText('4.5%')).toBeInTheDocument();
  });

  test('displays uploaded documents', () => {
    renderComponent();

    expect(screen.getByText('2 document(s) uploaded')).toBeInTheDocument();
    expect(screen.getByText('Driver License')).toBeInTheDocument();
    expect(screen.getByText('Pay Stub')).toBeInTheDocument();
  });

  test('shows message when no documents uploaded', () => {
    useLoanApplicationStore.mockReturnValue({
      draft: { ...mockDraft, documents: [] },
      previousStep: mockPreviousStep,
      clearDraft: mockClearDraft,
      saveDraftToServer: mockSaveDraftToServer,
    });

    renderComponent();

    expect(screen.getByText('No documents uploaded yet')).toBeInTheDocument();
  });

  test('handles terms checkbox toggle', () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('submit button is disabled when terms not agreed', () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when terms are agreed', () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    expect(submitButton).not.toBeDisabled();
  });

  test('submit button remains disabled when terms not agreed', () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    expect(submitButton).toBeDisabled();
  });

  test('submits application successfully', async () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockClearDraft).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      },
      { timeout: 3000 }
    );
  });

  test('calls previousStep when Previous button is clicked', () => {
    renderComponent();

    const previousButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(previousButton);

    expect(mockPreviousStep).toHaveBeenCalled();
  });

  test('handles missing optional fields gracefully', () => {
    useLoanApplicationStore.mockReturnValue({
      draft: {
        personalInfoAttributes: {},
        vehicleAttributes: {},
        financialInfoAttributes: {},
        documents: [],
      },
      previousStep: mockPreviousStep,
      clearDraft: mockClearDraft,
      saveDraftToServer: mockSaveDraftToServer,
    });

    renderComponent();

    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
  });

  test('formats phone number correctly', () => {
    renderComponent();

    expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();
  });

  test('masks SSN correctly', () => {
    renderComponent();

    expect(screen.getByText('***-**-6789')).toBeInTheDocument();
  });

  test('formats currency correctly', () => {
    renderComponent();

    expect(screen.getByText('$80,000.00')).toBeInTheDocument();
  });
});
