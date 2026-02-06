import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FinancialInformation from './FinancialInformation';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

jest.mock('../../stores/loanApplicationStore');
jest.mock('../../services/api', () => ({
  API_BASE: 'http://localhost:3000',
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));

describe('FinancialInformation Component', () => {
  let mockUpdateFinancialInfoAttributes;
  let mockNextStep;
  let mockPreviousStep;
  let mockSaveDraftToServer;

  const defaultDraft = {
    financialInfoAttributes: {
      employmentStatus: '',
      employer: '',
      jobTitle: '',
      yearsEmployed: '',
      annualIncome: '',
      additionalIncome: '',
      monthlyExpenses: '',
      creditScore: '',
    },
  };

  beforeEach(() => {
    mockUpdateFinancialInfoAttributes = jest.fn();
    mockNextStep = jest.fn();
    mockPreviousStep = jest.fn();
    mockSaveDraftToServer = jest.fn().mockResolvedValue();

    useLoanApplicationStore.mockReturnValue({
      draft: defaultDraft,
      updateFinancialInfoAttributes: mockUpdateFinancialInfoAttributes,
      nextStep: mockNextStep,
      previousStep: mockPreviousStep,
      saveDraftToServer: mockSaveDraftToServer,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form with title', () => {
      render(<FinancialInformation />);
      expect(screen.getByText('Financial Information')).toBeInTheDocument();
    });

    it('should render all required form fields', () => {
      render(<FinancialInformation />);

      expect(screen.getByLabelText(/employment status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/employer name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/years employed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/annual income/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/additional income/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/monthly expenses/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/credit score estimate/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<FinancialInformation />);

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should render employment status dropdown options', () => {
      render(<FinancialInformation />);

      const employmentSelect = screen.getByLabelText(/employment status/i);
      const options = employmentSelect.querySelectorAll('option');

      expect(options).toHaveLength(7);
      expect(options[0]).toHaveTextContent('Select status');
      expect(options[1]).toHaveTextContent('Full-Time');
      expect(options[2]).toHaveTextContent('Part-Time');
      expect(options[3]).toHaveTextContent('Self-Employed');
      expect(options[4]).toHaveTextContent('Contract');
      expect(options[5]).toHaveTextContent('Unemployed');
      expect(options[6]).toHaveTextContent('Retired');
    });

    it('should render credit score dropdown options', () => {
      render(<FinancialInformation />);

      const creditScoreSelect = screen.getByLabelText(/credit score estimate/i);
      const options = creditScoreSelect.querySelectorAll('option');

      expect(options).toHaveLength(5);
      expect(options[0]).toHaveTextContent('Select credit score range');
      expect(options[1]).toHaveTextContent('Excellent (750+)');
      expect(options[2]).toHaveTextContent('Good (700-749)');
      expect(options[3]).toHaveTextContent('Fair (650-699)');
      expect(options[4]).toHaveTextContent('Poor (Below 650)');
    });
  });

  describe('Form Population from Store', () => {
    it('should populate form fields with data from store', () => {
      const mockData = {
        financialInfoAttributes: {
          employmentStatus: 'full-time',
          employer: 'Acme Corp',
          jobTitle: 'Software Engineer',
          yearsEmployed: '5',
          annualIncome: '75000',
          additionalIncome: '5000',
          monthlyExpenses: '3000',
          creditScore: 'good',
        },
      };

      useLoanApplicationStore.mockReturnValue({
        draft: mockData,
        updateFinancialInfoAttributes: mockUpdateFinancialInfoAttributes,
        nextStep: mockNextStep,
        previousStep: mockPreviousStep,
        saveDraftToServer: mockSaveDraftToServer,
      });

      render(<FinancialInformation />);

      const employmentSelect = screen.getByLabelText(/employment status/i);
      const creditScoreSelect = screen.getByLabelText(/credit score estimate/i);

      expect(employmentSelect).toHaveValue('full-time');
      expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('75000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3000')).toBeInTheDocument();
      expect(creditScoreSelect).toHaveValue('good');
    });
  });

  describe('Validation - Required Fields', () => {
    it('should show error when employment status is empty', async () => {
      render(<FinancialInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Employment status is required')).toBeInTheDocument();
      });
    });

    it('should show error when employer name is empty', async () => {
      render(<FinancialInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Employer name is required')).toBeInTheDocument();
      });
    });

    it('should show error when job title is empty', async () => {
      render(<FinancialInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Job title is required')).toBeInTheDocument();
      });
    });

    it('should show error when all required fields are empty', async () => {
      render(<FinancialInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Employment status is required')).toBeInTheDocument();
        expect(screen.getByText('Employer name is required')).toBeInTheDocument();
        expect(screen.getByText('Job title is required')).toBeInTheDocument();
      });
    });
  });

  describe('Validation - Field Formats', () => {
    it('should show error when employer name is too short', async () => {
      render(<FinancialInformation />);

      const employerInput = screen.getByLabelText(/employer name/i);
      fireEvent.change(employerInput, { target: { value: 'A' } });
      fireEvent.blur(employerInput);

      await waitFor(() => {
        expect(screen.getByText('Employer name must be at least 2 characters')).toBeInTheDocument();
      });
    });

    it('should accept valid employer name', async () => {
      render(<FinancialInformation />);

      const employerInput = screen.getByLabelText(/employer name/i);
      fireEvent.change(employerInput, { target: { value: 'Acme Corp' } });
      fireEvent.blur(employerInput);

      await waitFor(() => {
        expect(screen.queryByText('Employer name must be at least 2 characters')).not.toBeInTheDocument();
      });
    });

    it('should show error when job title is too short', async () => {
      render(<FinancialInformation />);

      const jobTitleInput = screen.getByLabelText(/job title/i);
      fireEvent.change(jobTitleInput, { target: { value: 'A' } });
      fireEvent.blur(jobTitleInput);

      await waitFor(() => {
        expect(screen.getByText('Job title must be at least 2 characters')).toBeInTheDocument();
      });
    });

    it('should accept valid job title', async () => {
      render(<FinancialInformation />);

      const jobTitleInput = screen.getByLabelText(/job title/i);
      fireEvent.change(jobTitleInput, { target: { value: 'Engineer' } });
      fireEvent.blur(jobTitleInput);

      await waitFor(() => {
        expect(screen.queryByText('Job title must be at least 2 characters')).not.toBeInTheDocument();
      });
    });
  });

  describe('Validation - Numeric Fields', () => {
    it('should show error for negative years employed', async () => {
      render(<FinancialInformation />);

      const yearsInput = screen.getByLabelText(/years employed/i);
      fireEvent.change(yearsInput, { target: { value: '-1' } });
      fireEvent.blur(yearsInput);

      await waitFor(() => {
        expect(screen.getByText('Years employed cannot be negative')).toBeInTheDocument();
      });
    });

    it('should show error for years employed over 100', async () => {
      render(<FinancialInformation />);

      const yearsInput = screen.getByLabelText(/years employed/i);
      fireEvent.change(yearsInput, { target: { value: '101' } });
      fireEvent.blur(yearsInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid number of years')).toBeInTheDocument();
      });
    });

    it('should accept valid years employed with decimal', async () => {
      render(<FinancialInformation />);

      const yearsInput = screen.getByLabelText(/years employed/i);
      fireEvent.change(yearsInput, { target: { value: '5.5' } });
      fireEvent.blur(yearsInput);

      await waitFor(() => {
        expect(screen.queryByText('Years employed cannot be negative')).not.toBeInTheDocument();
        expect(screen.queryByText('Please enter a valid number of years')).not.toBeInTheDocument();
      });
    });

    it('should show error for negative annual income', async () => {
      render(<FinancialInformation />);

      const incomeInput = screen.getByLabelText(/annual income/i);
      fireEvent.change(incomeInput, { target: { value: '-1000' } });
      fireEvent.blur(incomeInput);

      await waitFor(() => {
        expect(screen.getByText('Annual income must be greater than or equal to 0')).toBeInTheDocument();
      });
    });

    it('should accept zero for annual income', async () => {
      render(<FinancialInformation />);

      const incomeInput = screen.getByLabelText(/annual income/i);
      fireEvent.change(incomeInput, { target: { value: '0' } });
      fireEvent.blur(incomeInput);

      await waitFor(() => {
        expect(screen.queryByText('Annual income must be greater than or equal to 0')).not.toBeInTheDocument();
      });
    });

    it('should show error for negative monthly expenses', async () => {
      render(<FinancialInformation />);

      const expensesInput = screen.getByLabelText(/monthly expenses/i);
      fireEvent.change(expensesInput, { target: { value: '-500' } });
      fireEvent.blur(expensesInput);

      await waitFor(() => {
        expect(screen.getByText('Monthly expenses must be greater than or equal to 0')).toBeInTheDocument();
      });
    });

    it('should show error for negative additional income', async () => {
      render(<FinancialInformation />);

      const additionalIncomeInput = screen.getByLabelText(/additional income/i);
      fireEvent.change(additionalIncomeInput, { target: { value: '-100' } });
      fireEvent.blur(additionalIncomeInput);

      await waitFor(() => {
        expect(screen.getByText('Additional income cannot be negative')).toBeInTheDocument();
      });
    });

    it('should accept valid positive values for all numeric fields', async () => {
      render(<FinancialInformation />);

      fireEvent.change(screen.getByLabelText(/years employed/i), { target: { value: '5' } });
      fireEvent.blur(screen.getByLabelText(/years employed/i));

      fireEvent.change(screen.getByLabelText(/annual income/i), { target: { value: '75000' } });
      fireEvent.blur(screen.getByLabelText(/annual income/i));

      fireEvent.change(screen.getByLabelText(/additional income/i), { target: { value: '5000' } });
      fireEvent.blur(screen.getByLabelText(/additional income/i));

      fireEvent.change(screen.getByLabelText(/monthly expenses/i), { target: { value: '3000' } });
      fireEvent.blur(screen.getByLabelText(/monthly expenses/i));

      await waitFor(() => {
        expect(screen.queryByText(/cannot be negative/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/must be greater/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Save Draft Functionality', () => {
    it('should call saveDraftToServer when Save Draft button is clicked', async () => {
      render(<FinancialInformation />);

      // Fill in required fields to pass validation
      const employmentStatusSelect = screen.getByLabelText(/employment status/i);
      fireEvent.change(employmentStatusSelect, { target: { value: 'full-time' } });

      const employerInput = screen.getByLabelText(/employer name/i);
      fireEvent.change(employerInput, { target: { value: 'Test Corp' } });

      const jobTitleInput = screen.getByLabelText(/job title/i);
      fireEvent.change(jobTitleInput, { target: { value: 'Engineer' } });

      const yearsEmployedInput = screen.getByLabelText(/years employed/i);
      fireEvent.change(yearsEmployedInput, { target: { value: '5' } });

      const annualIncomeInput = screen.getByLabelText(/annual income/i);
      fireEvent.change(annualIncomeInput, { target: { value: '80000' } });

      const monthlyExpensesInput = screen.getByLabelText(/monthly expenses/i);
      fireEvent.change(monthlyExpensesInput, { target: { value: '2000' } });

      const creditScoreInput = screen.getByLabelText(/credit score estimate/i);
      fireEvent.change(creditScoreInput, { target: { value: 'good' } });

      const saveDraftButton = screen.getByRole('button', { name: /save draft/i });
      fireEvent.click(saveDraftButton);

      await waitFor(
        () => {
          expect(mockUpdateFinancialInfoAttributes).toHaveBeenCalled();
          expect(mockSaveDraftToServer).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Navigation', () => {
    it('should call previousStep when Previous button is clicked', () => {
      render(<FinancialInformation />);

      const previousButton = screen.getByRole('button', { name: /previous/i });
      fireEvent.click(previousButton);

      expect(mockPreviousStep).toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should not submit form when validation fails', async () => {
      render(<FinancialInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockUpdateFinancialInfoAttributes).not.toHaveBeenCalled();
        expect(mockNextStep).not.toHaveBeenCalled();
      });
    });

    it('should submit form and call nextStep when all validations pass', async () => {
      render(<FinancialInformation />);

      const employmentStatusInput = screen.getByLabelText(/employment status/i);
      fireEvent.change(employmentStatusInput, { target: { value: 'full-time' } });
      fireEvent.blur(employmentStatusInput);

      const employerInput = screen.getByLabelText(/employer name/i);
      fireEvent.change(employerInput, { target: { value: 'Acme Corp' } });
      fireEvent.blur(employerInput);

      const jobTitleInput = screen.getByLabelText(/job title/i);
      fireEvent.change(jobTitleInput, { target: { value: 'Engineer' } });
      fireEvent.blur(jobTitleInput);

      const yearsEmployedInput = screen.getByLabelText(/years employed/i);
      fireEvent.change(yearsEmployedInput, { target: { value: '5' } });
      fireEvent.blur(yearsEmployedInput);

      const annualIncomeInput = screen.getByLabelText(/annual income/i);
      fireEvent.change(annualIncomeInput, { target: { value: '75000' } });
      fireEvent.blur(annualIncomeInput);

      const monthlyExpensesInput = screen.getByLabelText(/monthly expenses/i);
      fireEvent.change(monthlyExpensesInput, { target: { value: '3000' } });
      fireEvent.blur(monthlyExpensesInput);

      const creditScoreInput = screen.getByLabelText(/credit score estimate/i);
      fireEvent.change(creditScoreInput, { target: { value: 'good' } });
      fireEvent.blur(creditScoreInput);

      await waitFor(() => {
        expect(screen.queryByText(/is required|cannot be negative/i)).not.toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockUpdateFinancialInfoAttributes).toHaveBeenCalledWith({
          employmentStatus: 'full-time',
          employer: 'Acme Corp',
          jobTitle: 'Engineer',
          yearsEmployed: '5',
          annualIncome: '75000',
          additionalIncome: '',
          monthlyExpenses: '3000',
          creditScore: 'good',
        });
        expect(mockNextStep).toHaveBeenCalled();
      });
    });

    it('should not submit form when numeric validation fails', async () => {
      render(<FinancialInformation />);

      const employmentStatusInput = screen.getByLabelText(/employment status/i);
      fireEvent.change(employmentStatusInput, { target: { value: 'full-time' } });
      fireEvent.blur(employmentStatusInput);

      const employerInput = screen.getByLabelText(/employer name/i);
      fireEvent.change(employerInput, { target: { value: 'Acme Corp' } });
      fireEvent.blur(employerInput);

      const jobTitleInput = screen.getByLabelText(/job title/i);
      fireEvent.change(jobTitleInput, { target: { value: 'Engineer' } });
      fireEvent.blur(jobTitleInput);

      const yearsEmployedInput = screen.getByLabelText(/years employed/i);
      fireEvent.change(yearsEmployedInput, { target: { value: '-5' } });
      fireEvent.blur(yearsEmployedInput);

      await waitFor(() => {
        expect(screen.getByText('Years employed cannot be negative')).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockNextStep).not.toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<FinancialInformation />);

      const employmentStatusInput = screen.getByLabelText(/employment status/i);
      const employerInput = screen.getByLabelText(/employer name/i);
      const jobTitleInput = screen.getByLabelText(/job title/i);

      expect(employmentStatusInput).toHaveAttribute('id', 'employmentStatus');
      expect(employerInput).toHaveAttribute('id', 'employer');
      expect(jobTitleInput).toHaveAttribute('id', 'jobTitle');
    });

    it('should display error messages with proper styling', async () => {
      render(<FinancialInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByText(/is required/i);
        errorMessages.forEach((error) => {
          expect(error).toHaveClass('text-red-500');
        });
      });
    });
  });
});
