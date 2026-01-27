import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalInformation from './PersonalInformation';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

jest.mock('../../stores/loanApplicationStore');
jest.mock('../../services/api', () => ({
  API_BASE: process.env.VITE_API_URL ,
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));

describe('PersonalInformation Component', () => {
  let mockUpdatePersonalInfo;
  let mockNextStep;
  let mockSaveDraftToServer;

  const defaultDraft = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      ssn: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
    },
  };

  beforeEach(() => {
    mockUpdatePersonalInfo = jest.fn();
    mockNextStep = jest.fn();
    mockSaveDraftToServer = jest.fn().mockResolvedValue();

    useLoanApplicationStore.mockReturnValue({
      draft: defaultDraft,
      updatePersonalInfo: mockUpdatePersonalInfo,
      nextStep: mockNextStep,
      saveDraftToServer: mockSaveDraftToServer,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form with title', () => {
      render(<PersonalInformation />);
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    it('should render all required form fields', () => {
      render(<PersonalInformation />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ssn/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<PersonalInformation />);

      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should render all US states in dropdown', () => {
      render(<PersonalInformation />);

      const stateSelect = screen.getByLabelText(/state/i);
      const options = stateSelect.querySelectorAll('option');

      expect(options).toHaveLength(51);
      expect(options[0]).toHaveTextContent('Select State');
      expect(options[1]).toHaveTextContent('Alabama');
    });
  });

  describe('Form Population from Store', () => {
    it('should populate form fields with data from store', () => {
      const mockData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '5551234567',
          dateOfBirth: '1990-01-01',
          ssn: '123456789',
          streetAddress: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
      };

      useLoanApplicationStore.mockReturnValue({
        draft: mockData,
        updatePersonalInfo: mockUpdatePersonalInfo,
        nextStep: mockNextStep,
        saveDraftToServer: mockSaveDraftToServer,
      });

      render(<PersonalInformation />);

      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5551234567')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
    });
  });

  describe('Validation - Required Fields', () => {
    it('should show error when first name is empty', async () => {
      render(<PersonalInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
    });

    it('should show error when last name is empty', async () => {
      render(<PersonalInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });
    });

    it('should show error when email is empty', async () => {
      render(<PersonalInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('should show error when all required fields are empty', async () => {
      render(<PersonalInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Phone number is required')).toBeInTheDocument();
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      });
    });
  });

  describe('Validation - Field Formats', () => {
    it('should show error for invalid email format', async () => {
      render(<PersonalInformation />);

      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('should accept valid email format', async () => {
      render(<PersonalInformation />);

      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });

    it('should show error for invalid phone number', async () => {
      render(<PersonalInformation />);

      const phoneInput = screen.getByLabelText(/phone number/i);
      fireEvent.change(phoneInput, { target: { value: '123' } });
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid 10-digit phone number')).toBeInTheDocument();
      });
    });

    it('should accept valid 10-digit phone number', async () => {
      render(<PersonalInformation />);

      const phoneInput = screen.getByLabelText(/phone number/i);
      fireEvent.change(phoneInput, { target: { value: '5551234567' } });
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid 10-digit phone number')).not.toBeInTheDocument();
      });
    });

    it('should show error for invalid SSN', async () => {
      render(<PersonalInformation />);

      const ssnInput = screen.getByLabelText(/ssn/i);
      fireEvent.change(ssnInput, { target: { value: '123' } });
      fireEvent.blur(ssnInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid 9-digit SSN')).toBeInTheDocument();
      });
    });

    it('should accept valid 9-digit SSN', async () => {
      render(<PersonalInformation />);

      const ssnInput = screen.getByLabelText(/ssn/i);
      fireEvent.change(ssnInput, { target: { value: '123456789' } });
      fireEvent.blur(ssnInput);

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid 9-digit SSN')).not.toBeInTheDocument();
      });
    });

    it('should show error for invalid ZIP code', async () => {
      render(<PersonalInformation />);

      const zipInput = screen.getByLabelText(/zip code/i);
      fireEvent.change(zipInput, { target: { value: '123' } });
      fireEvent.blur(zipInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid 5-digit ZIP code')).toBeInTheDocument();
      });
    });

    it('should accept valid 5-digit ZIP code', async () => {
      render(<PersonalInformation />);

      const zipInput = screen.getByLabelText(/zip code/i);
      fireEvent.change(zipInput, { target: { value: '12345' } });
      fireEvent.blur(zipInput);

      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid 5-digit ZIP code')).not.toBeInTheDocument();
      });
    });

    it('should show error for names with non-letter characters', async () => {
      render(<PersonalInformation />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John123' } });
      fireEvent.blur(firstNameInput);

      await waitFor(() => {
        expect(screen.getByText('First name should only contain letters')).toBeInTheDocument();
      });
    });
  });

  describe('Validation - Age Requirement', () => {
    it('should show error for users under 18 years old', async () => {
      render(<PersonalInformation />);

      const today = new Date();
      const seventeenYearsAgo = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
      const dateString = seventeenYearsAgo.toISOString().split('T')[0];

      const dobInput = screen.getByLabelText(/date of birth/i);
      fireEvent.change(dobInput, { target: { value: dateString } });
      fireEvent.blur(dobInput);

      await waitFor(() => {
        expect(screen.getByText('You must be at least 18 years old')).toBeInTheDocument();
      });
    });

    it('should accept users 18 years or older', async () => {
      render(<PersonalInformation />);

      const today = new Date();
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const dateString = eighteenYearsAgo.toISOString().split('T')[0];

      const dobInput = screen.getByLabelText(/date of birth/i);
      fireEvent.change(dobInput, { target: { value: dateString } });
      fireEvent.blur(dobInput);

      await waitFor(() => {
        expect(screen.queryByText('You must be at least 18 years old')).not.toBeInTheDocument();
      });
    });
  });

  describe('Save Draft Functionality', () => {
    it('should call saveDraftToServer when Save Draft button is clicked', async () => {
      render(<PersonalInformation />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });

      const saveDraftButton = screen.getByRole('button', { name: /save draft/i });
      fireEvent.click(saveDraftButton);

      await waitFor(() => {
        expect(mockUpdatePersonalInfo).toHaveBeenCalled();
        expect(mockSaveDraftToServer).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should not submit form when validation fails', async () => {
      render(<PersonalInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockUpdatePersonalInfo).not.toHaveBeenCalled();
        expect(mockNextStep).not.toHaveBeenCalled();
      });
    });

    it('should submit form and call nextStep when all validations pass', async () => {
      render(<PersonalInformation />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.blur(firstNameInput);

      const lastNameInput = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.blur(lastNameInput);

      const emailInput = screen.getByLabelText(/email address/i);
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.blur(emailInput);

      const phoneInput = screen.getByLabelText(/phone number/i);
      fireEvent.change(phoneInput, { target: { value: '5551234567' } });
      fireEvent.blur(phoneInput);

      const dobInput = screen.getByLabelText(/date of birth/i);
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.blur(dobInput);

      const ssnInput = screen.getByLabelText(/ssn/i);
      fireEvent.change(ssnInput, { target: { value: '123456789' } });
      fireEvent.blur(ssnInput);

      const streetInput = screen.getByLabelText(/street address/i);
      fireEvent.change(streetInput, { target: { value: '123 Main St' } });
      fireEvent.blur(streetInput);

      const cityInput = screen.getByLabelText(/city/i);
      fireEvent.change(cityInput, { target: { value: 'New York' } });
      fireEvent.blur(cityInput);

      const stateInput = screen.getByLabelText(/state/i);
      fireEvent.change(stateInput, { target: { value: 'NY' } });
      fireEvent.blur(stateInput);

      const zipInput = screen.getByLabelText(/zip code/i);
      fireEvent.change(zipInput, { target: { value: '10001' } });
      fireEvent.blur(zipInput);

      // Wait for validation to complete
      await waitFor(() => {
        expect(screen.queryByText(/is required|Please enter/i)).not.toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockUpdatePersonalInfo).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '5551234567',
          dateOfBirth: '1990-01-01',
          ssn: '123456789',
          streetAddress: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        });
        expect(mockNextStep).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<PersonalInformation />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email address/i);

      expect(firstNameInput).toHaveAttribute('id', 'firstName');
      expect(lastNameInput).toHaveAttribute('id', 'lastName');
      expect(emailInput).toHaveAttribute('id', 'email');
    });

    it('should display error messages with proper styling', async () => {
      render(<PersonalInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByText(/is required|Please enter/i);
        errorMessages.forEach((error) => {
          expect(error).toHaveClass('text-red-500');
        });
      });
    });
  });
});
