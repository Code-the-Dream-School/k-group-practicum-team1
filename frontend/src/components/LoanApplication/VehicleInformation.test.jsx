import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehicleInformation from './VehicleInformation';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

jest.mock('../../stores/loanApplicationStore');
jest.mock('../../services/api', () => ({
  API_BASE: 'http://localhost:3000',
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));

jest.mock('../../utils/vehicleData', () => ({
  carMakes: ['Toyota', 'Honda', 'Ford'],
  carModels: {
    Toyota: ['Camry', 'Corolla', 'RAV4'],
    Honda: ['Civic', 'Accord', 'CR-V'],
    Ford: ['F-150', 'Mustang', 'Explorer'],
  },
  commonTrims: ['Base', 'Sport', 'Limited'],
}));

describe('VehicleInformation Component', () => {
  let mockUpdateVehicleAttributes;
  let mockNextStep;
  let mockPreviousStep;
  let mockSaveDraftToServer;

  const defaultDraft = {
    vehicleAttributes: {
      vehicleType: '',
      year: '',
      make: '',
      model: '',
      trim: '',
      vin: '',
      mileage: '',
      purchasePrice: '',
    },
  };

  beforeEach(() => {
    mockUpdateVehicleAttributes = jest.fn();
    mockNextStep = jest.fn();
    mockPreviousStep = jest.fn();
    mockSaveDraftToServer = jest.fn().mockResolvedValue();


    useLoanApplicationStore.mockReturnValue({
      draft: defaultDraft,
      updateVehicleAttributes: mockUpdateVehicleAttributes,
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
      render(<VehicleInformation />);
      expect(screen.getByText('Vehicle Information')).toBeInTheDocument();
    });

    it('should render vehicle type radio buttons', () => {
      render(<VehicleInformation />);

      expect(screen.getByLabelText('New')).toBeInTheDocument();
      expect(screen.getByLabelText('Certified Used')).toBeInTheDocument();
      expect(screen.getByLabelText('Used')).toBeInTheDocument();
    });

    it('should render all required form fields', () => {
      render(<VehicleInformation />);

      expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/trim/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/vin/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mileage/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/purchase price/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<VehicleInformation />);

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should render year dropdown with options', () => {
      render(<VehicleInformation />);

      const yearSelect = screen.getByLabelText(/year/i);
      const options = yearSelect.querySelectorAll('option');

      expect(options.length).toBeGreaterThan(30);
    });
  });

  describe('Form Population from Store', () => {
    it('should populate form fields with data from store', () => {
      const mockData = {
        vehicleAttributes: {
          vehicleType: 'new',
          year: '2024',
          make: 'Toyota',
          model: 'Camry',
          trim: 'Sport',
          vin: '1HGBH41JXMN109186',
          mileage: '15000',
        },
        purchasePrice: '30000',
      };

      useLoanApplicationStore.mockReturnValue({
        draft: mockData,
        updateVehicleAttributes: mockUpdateVehicleAttributes,
        nextStep: mockNextStep,
        previousStep: mockPreviousStep,
        saveDraftToServer: mockSaveDraftToServer,
      });

      render(<VehicleInformation />);

      expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Toyota')).toBeInTheDocument();
      expect(screen.getByDisplayValue('15000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30000')).toBeInTheDocument();
    });
  });

  describe('Validation - Required Fields', () => {
    it('should show error when vehicle type is not selected', async () => {
      render(<VehicleInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Vehicle type is required')).toBeInTheDocument();
      });
    });

    it('should show error when year is empty', async () => {
      render(<VehicleInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Year is required')).toBeInTheDocument();
      });
    });

    it('should show error when make is empty', async () => {
      render(<VehicleInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Make is required')).toBeInTheDocument();
      });
    });

    it('should show error when model is empty', async () => {
      render(<VehicleInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Model is required')).toBeInTheDocument();
      });
    });

    it('should show error when mileage is empty', async () => {
      render(<VehicleInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Mileage is required')).toBeInTheDocument();
      });
    });

    it('should show error when purchase price is empty', async () => {
      render(<VehicleInformation />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Purchase price is required')).toBeInTheDocument();
      });
    });
  });

  describe('Validation - VIN', () => {
    it('should show error for invalid VIN length', async () => {
      render(<VehicleInformation />);

      const vinInput = screen.getByLabelText(/vin/i);
      fireEvent.change(vinInput, { target: { value: '123' } });
      fireEvent.blur(vinInput);

      await waitFor(() => {
        expect(screen.getByText('VIN must be exactly 17 characters')).toBeInTheDocument();
      });
    });

    it('should show error for VIN with invalid characters', async () => {
      render(<VehicleInformation />);

      const vinInput = screen.getByLabelText(/vin/i);
      fireEvent.change(vinInput, { target: { value: '1HGBH41JXMN10918I' } });
      fireEvent.blur(vinInput);

      await waitFor(() => {
        expect(screen.getByText('VIN contains invalid characters (I, O, Q not allowed)')).toBeInTheDocument();
      });
    });

    it('should accept valid 17-character VIN', async () => {
      render(<VehicleInformation />);

      const vinInput = screen.getByLabelText(/vin/i);
      fireEvent.change(vinInput, { target: { value: '1HGBH41JXMN109186' } });
      fireEvent.blur(vinInput);

      await waitFor(() => {
        expect(screen.queryByText(/must be exactly 17 characters/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/invalid characters/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Validation - Mileage and Price', () => {
    it('should show error for negative mileage', async () => {
      render(<VehicleInformation />);

      const mileageInput = screen.getByLabelText(/mileage/i);
      fireEvent.change(mileageInput, { target: { value: '-100' } });
      fireEvent.blur(mileageInput);

      await waitFor(() => {
        expect(screen.getByText('Mileage cannot be negative')).toBeInTheDocument();
      });
    });

    it('should show error for excessively high mileage', async () => {
      render(<VehicleInformation />);

      const mileageInput = screen.getByLabelText(/mileage/i);
      fireEvent.change(mileageInput, { target: { value: '9999999' } });
      fireEvent.blur(mileageInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid mileage')).toBeInTheDocument();
      });
    });

    it('should show error for negative price', async () => {
      render(<VehicleInformation />);

      const priceInput = screen.getByLabelText(/purchase price/i);
      fireEvent.change(priceInput, { target: { value: '-5000' } });
      fireEvent.blur(priceInput);

      await waitFor(() => {
        expect(screen.getByText('Price cannot be negative')).toBeInTheDocument();
      });
    });

    it('should show error for excessively high price', async () => {
      render(<VehicleInformation />);

      const priceInput = screen.getByLabelText(/purchase price/i);
      fireEvent.change(priceInput, { target: { value: '2000000' } });
      fireEvent.blur(priceInput);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid purchase price')).toBeInTheDocument();
      });
    });
  });

  describe('Make/Model Dependency', () => {
    it('should disable model dropdown when no make is selected', () => {
      render(<VehicleInformation />);

      const modelSelect = screen.getByLabelText(/model/i);
      expect(modelSelect).toBeDisabled();
    });

    it('should enable model dropdown when make is selected', async () => {
      render(<VehicleInformation />);

      const makeSelect = screen.getByLabelText(/make/i);
      fireEvent.change(makeSelect, { target: { value: 'Toyota' } });

      await waitFor(() => {
        const modelSelect = screen.getByLabelText(/model/i);
        expect(modelSelect).not.toBeDisabled();
      });
    });

    it('should populate model options based on selected make', async () => {
      render(<VehicleInformation />);

      const makeSelect = screen.getByLabelText(/make/i);
      fireEvent.change(makeSelect, { target: { value: 'Toyota' } });

      await waitFor(() => {
        expect(screen.getByText('Camry')).toBeInTheDocument();
        expect(screen.getByText('Corolla')).toBeInTheDocument();
        expect(screen.getByText('RAV4')).toBeInTheDocument();
      });
    });
  });

  describe('Save Draft Functionality', () => {
    it('should call saveDraftToServer when Save Draft button is clicked', async () => {
      render(<VehicleInformation />);

      // Fill in required fields to pass validation
      const newRadio = screen.getByLabelText('New');
      fireEvent.click(newRadio);

      const yearInput = screen.getByLabelText(/year/i);
      fireEvent.change(yearInput, { target: { value: '2023' } });

      const makeInput = screen.getByLabelText(/make/i);
      fireEvent.change(makeInput, { target: { value: 'Toyota' } });

      const modelInput = screen.getByLabelText(/model/i);
      fireEvent.change(modelInput, { target: { value: 'Camry' } });

      const vinInput = screen.getByLabelText(/vin/i);
      fireEvent.change(vinInput, { target: { value: '1HGBH41JXMN109186' } });

      const mileageInput = screen.getByLabelText(/mileage/i);
      fireEvent.change(mileageInput, { target: { value: '10000' } });

      const purchasePriceInput = screen.getByLabelText(/purchase price/i);
      fireEvent.change(purchasePriceInput, { target: { value: '30000' } });

      const saveDraftButton = screen.getByRole('button', { name: /save draft/i });
      fireEvent.click(saveDraftButton);

      await waitFor(() => {
        expect(mockUpdateVehicleAttributes).toHaveBeenCalled();
        expect(mockSaveDraftToServer).toHaveBeenCalled();
      });
    });
  });

  describe('Navigation', () => {
    it('should call previousStep when Previous button is clicked', () => {
      render(<VehicleInformation />);

      const previousButton = screen.getByRole('button', { name: /previous/i });
      fireEvent.click(previousButton);

      expect(mockUpdateVehicleAttributes).toHaveBeenCalled();
      expect(mockPreviousStep).toHaveBeenCalled();
    });

    it('should submit form and call nextStep with valid data', async () => {
      render(<VehicleInformation />);

      const newRadio = screen.getByLabelText('New');
      fireEvent.click(newRadio);

      const yearSelect = screen.getByLabelText(/year/i);
      fireEvent.change(yearSelect, { target: { value: '2024' } });

      const makeSelect = screen.getByLabelText(/make/i);
      fireEvent.change(makeSelect, { target: { value: 'Toyota' } });

      await waitFor(() => {
        const modelSelect = screen.getByLabelText(/model/i);
        fireEvent.change(modelSelect, { target: { value: 'Camry' } });
      });

      const mileageInput = screen.getByLabelText(/mileage/i);
      fireEvent.change(mileageInput, { target: { value: '15000' } });

      const priceInput = screen.getByLabelText(/purchase price/i);
      fireEvent.change(priceInput, { target: { value: '30000' } });

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockUpdateVehicleAttributes).toHaveBeenCalledWith(
          expect.objectContaining({
            vehicleType: 'new',
            year: '2024',
            make: 'Toyota',
            model: 'Camry',
            mileage: '15000',
            purchasePrice: '30000',
          })
        );
        expect(mockNextStep).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<VehicleInformation />);

      const yearInput = screen.getByLabelText(/year/i);
      const makeInput = screen.getByLabelText(/make/i);
      const modelInput = screen.getByLabelText(/model/i);

      expect(yearInput).toHaveAttribute('id', 'year');
      expect(makeInput).toHaveAttribute('id', 'make');
      expect(modelInput).toHaveAttribute('id', 'model');
    });

    it('should display error messages with proper styling', async () => {
      render(<VehicleInformation />);

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
