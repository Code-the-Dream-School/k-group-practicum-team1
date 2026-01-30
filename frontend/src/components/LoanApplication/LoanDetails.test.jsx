import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoanDetails from './LoanDetails';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

jest.mock('../../stores/loanApplicationStore');

describe('LoanDetails Component', () => {
  let mockUpdateLoanDetails;
  let mockNextStep;
  let mockPreviousStep;
  let mockSaveDraftToServer;

  const defaultDraft = {
    vehicleDetails: {
      purchasePrice: '30000',
      downPayment: '5000',
    },
    loanDetails: {
      loanTerm: '',
    },
  };

  beforeEach(() => {
    mockUpdateLoanDetails = jest.fn();
    mockNextStep = jest.fn();
    mockPreviousStep = jest.fn();
    mockSaveDraftToServer = jest.fn().mockResolvedValue();

    window.alert = jest.fn();

    useLoanApplicationStore.mockReturnValue({
      draft: defaultDraft,
      updateLoanDetails: mockUpdateLoanDetails,
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
      render(<LoanDetails />);
      expect(screen.getByText('Loan Details')).toBeInTheDocument();
    });

    it('should display vehicle purchase summary', () => {
      render(<LoanDetails />);
      expect(screen.getByText('Vehicle Purchase Summary')).toBeInTheDocument();
      expect(screen.getByText('Vehicle Price')).toBeInTheDocument();
      expect(screen.getByText('Down Payment')).toBeInTheDocument();
      expect(screen.getByText('Loan Amount')).toBeInTheDocument();
    });

    it('should display vehicle price from draft', () => {
      render(<LoanDetails />);
      expect(screen.getByText('$30,000.00')).toBeInTheDocument();
    });

    it('should render loan term selection heading', () => {
      render(<LoanDetails />);
      expect(screen.getByText('Select Loan Term:')).toBeInTheDocument();
    });

    it('should render all loan term option cards', () => {
      render(<LoanDetails />);
      expect(screen.getByText('24 Months')).toBeInTheDocument();
      expect(screen.getByText('36 Months')).toBeInTheDocument();
      expect(screen.getByText('48 Months')).toBeInTheDocument();
      expect(screen.getByText('60 Months')).toBeInTheDocument();
      expect(screen.getByText('72 Months')).toBeInTheDocument();
      expect(screen.getByText('84 Months')).toBeInTheDocument();
    });

    it('should display "Most Popular" badge on 48 months option', () => {
      render(<LoanDetails />);
      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<LoanDetails />);
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should render down payment input field', () => {
      render(<LoanDetails />);
      const downPaymentInput = screen.getByLabelText(/down payment/i);
      expect(downPaymentInput).toBeInTheDocument();
      expect(downPaymentInput).toHaveAttribute('type', 'number');
    });
  });

  describe('Down Payment Input', () => {
    it('should populate down payment from draft', () => {
      render(<LoanDetails />);
      const downPaymentInput = screen.getByLabelText(/down payment/i);
      expect(downPaymentInput).toHaveValue(5000);
    });

    it('should update loan amount when down payment changes', async () => {
      render(<LoanDetails />);
      const downPaymentInput = screen.getByLabelText(/down payment/i);

      fireEvent.change(downPaymentInput, { target: { value: '10000' } });

      await waitFor(() => {
        expect(screen.getByText('$20,000.00')).toBeInTheDocument();
      });
    });

    it('should show validation error for negative down payment', async () => {
      render(<LoanDetails />);
      const downPaymentInput = screen.getByLabelText(/down payment/i);

      fireEvent.change(downPaymentInput, { target: { value: '-1000' } });
      fireEvent.blur(downPaymentInput);

      await waitFor(() => {
        expect(screen.getByText('Down payment cannot be negative')).toBeInTheDocument();
      });
    });

    it('should show validation error when down payment exceeds vehicle price', async () => {
      render(<LoanDetails />);
      const downPaymentInput = screen.getByLabelText(/down payment/i);

      fireEvent.change(downPaymentInput, { target: { value: '35000' } });
      fireEvent.blur(downPaymentInput);

      await waitFor(() => {
        expect(screen.getByText('Down payment cannot exceed vehicle price')).toBeInTheDocument();
      });
    });

    it('should calculate correct loan amount', () => {
      render(<LoanDetails />);
      // Vehicle price: $30,000, Down payment: $5,000
      // Expected loan amount: $25,000
      expect(screen.getByText('$25,000.00')).toBeInTheDocument();
    });
  });

  describe('Loan Term Selection', () => {
    it('should allow selecting a loan term', async () => {
      render(<LoanDetails />);
      const term48Button = screen.getByText('48 Months').closest('button');

      fireEvent.click(term48Button);

      await waitFor(() => {
        expect(term48Button).toHaveClass('bg-blue-500');
      });
    });

    it('should display monthly payment when loan term is selected', async () => {
      render(<LoanDetails />);
      const term48Button = screen.getByText('48 Months').closest('button');

      fireEvent.click(term48Button);

      await waitFor(() => {
        expect(screen.getByText('Estimated Monthly Payment')).toBeInTheDocument();
        expect(screen.getByText('Principal & Interest')).toBeInTheDocument();
        expect(screen.getByText('Estimated Insurance')).toBeInTheDocument();
      });
    });

    it('should show correct APR for each term', () => {
      render(<LoanDetails />);
      expect(screen.getByText('4.3% APR')).toBeInTheDocument();
      expect(screen.getByText('4.9% APR')).toBeInTheDocument();
      expect(screen.getByText('5.5% APR')).toBeInTheDocument();
      expect(screen.getByText('6.2% APR')).toBeInTheDocument();
      expect(screen.getByText('6.9% APR')).toBeInTheDocument();
      expect(screen.getByText('7.5% APR')).toBeInTheDocument();
    });

    it('should highlight selected loan term card', async () => {
      render(<LoanDetails />);
      const term36Button = screen.getByText('36 Months').closest('button');

      expect(term36Button).toHaveClass('bg-white');

      fireEvent.click(term36Button);

      await waitFor(() => {
        expect(term36Button).toHaveClass('bg-blue-500');
      });
    });
  });

  describe('Monthly Payment Calculation', () => {
    it('should display monthly payment breakdown when term is selected', async () => {
      render(<LoanDetails />);
      const term48Button = screen.getByText('48 Months').closest('button');

      fireEvent.click(term48Button);

      await waitFor(() => {
        expect(screen.getByText('Principal & Interest')).toBeInTheDocument();
        expect(screen.getByText(/estimated insurance/i)).toBeInTheDocument();
        expect(screen.getByText('Total Monthly Payment')).toBeInTheDocument();
      });
    });

    it('should show insurance note about full coverage', async () => {
      render(<LoanDetails />);
      const term48Button = screen.getByText('48 Months').closest('button');

      fireEvent.click(term48Button);

      await waitFor(() => {
        expect(screen.getByText('Full coverage required')).toBeInTheDocument();
      });
    });

    it('should display disclaimer about estimate', async () => {
      render(<LoanDetails />);
      const term48Button = screen.getByText('48 Months').closest('button');

      fireEvent.click(term48Button);

      await waitFor(() => {
        expect(
          screen.getByText(/actual rates and payment amounts will be determined after credit approval/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Form Actions', () => {
    it('should call previousStep when Previous button is clicked', () => {
      render(<LoanDetails />);
      const previousButton = screen.getByRole('button', { name: /previous/i });

      fireEvent.click(previousButton);

      expect(mockPreviousStep).toHaveBeenCalledTimes(1);
    });

    it('should save draft when Save Draft button is clicked', async () => {
      render(<LoanDetails />);
      const saveDraftButton = screen.getByRole('button', { name: /save draft/i });

      fireEvent.click(saveDraftButton);

      await waitFor(() => {
        expect(mockUpdateLoanDetails).toHaveBeenCalled();
        expect(mockSaveDraftToServer).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Draft saved successfully!');
      });
    });

    it('should show error alert when save draft fails', async () => {
      mockSaveDraftToServer.mockRejectedValue(new Error('Network error'));
      render(<LoanDetails />);
      const saveDraftButton = screen.getByRole('button', { name: /save draft/i });

      fireEvent.click(saveDraftButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Failed to save draft. Please try again.');
      });
    });

    it('should disable Next button when no loan term is selected', () => {
      render(<LoanDetails />);
      const nextButton = screen.getByRole('button', { name: /next/i });

      expect(nextButton).toBeDisabled();
    });

    it('should enable Next button when loan term is selected', async () => {
      render(<LoanDetails />);
      const term48Button = screen.getByText('48 Months').closest('button');
      const nextButton = screen.getByRole('button', { name: /next/i });

      fireEvent.click(term48Button);

      await waitFor(() => {
        expect(nextButton).not.toBeDisabled();
      });
    });

    it('should submit form and proceed to next step', async () => {
      render(<LoanDetails />);

      const downPaymentInput = screen.getByLabelText(/down payment/i);
      fireEvent.change(downPaymentInput, { target: { value: '6000' } });

      const term48Button = screen.getByText('48 Months').closest('button');
      fireEvent.click(term48Button);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockUpdateLoanDetails).toHaveBeenCalledWith(
          expect.objectContaining({
            loanTerm: '48',
            downPayment: 6000,
            loanAmount: 24000,
          })
        );
        expect(mockNextStep).toHaveBeenCalledTimes(1);
      });
    });

    it('should require down payment before submission', async () => {
      render(<LoanDetails />);

      const downPaymentInput = screen.getByLabelText(/down payment/i);
      fireEvent.change(downPaymentInput, { target: { value: '' } });

      const term48Button = screen.getByText('48 Months').closest('button');
      fireEvent.click(term48Button);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Down payment is required')).toBeInTheDocument();
        expect(mockNextStep).not.toHaveBeenCalled();
      });
    });
  });

  describe('Integration with Store', () => {
    it('should load existing loan term from draft', () => {
      const draftWithLoanTerm = {
        ...defaultDraft,
        loanDetails: { loanTerm: '60' },
      };

      useLoanApplicationStore.mockReturnValue({
        draft: draftWithLoanTerm,
        updateLoanDetails: mockUpdateLoanDetails,
        nextStep: mockNextStep,
        previousStep: mockPreviousStep,
        saveDraftToServer: mockSaveDraftToServer,
      });

      render(<LoanDetails />);
      const term60Button = screen.getByText('60 Months').closest('button');

      expect(term60Button).toHaveClass('bg-blue-500');
    });

    it('should update store with loan details on submission', async () => {
      render(<LoanDetails />);

      const downPaymentInput = screen.getByLabelText(/down payment/i);
      fireEvent.change(downPaymentInput, { target: { value: '8000' } });

      const term36Button = screen.getByText('36 Months').closest('button');
      fireEvent.click(term36Button);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockUpdateLoanDetails).toHaveBeenCalledWith({
          loanTerm: '36',
          downPayment: 8000,
          loanAmount: 22000,
          interestRate: expect.any(Number),
        });
      });
    });
  });
});
