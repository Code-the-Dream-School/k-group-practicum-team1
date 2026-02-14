import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentsUpload from './DocumentsUpload';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';
import { toast } from 'react-toastify';
jest.mock('../../stores/loanApplicationStore');
jest.mock('../../services/api', () => ({
  API_BASE: 'http://localhost:3000',
  apiFetch: jest.fn(),
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));
describe('DocumentsUpload', () => {
  const mockUpdateDocuments = jest.fn();
  const mockNextStep = jest.fn();
  const mockPreviousStep = jest.fn();
  const mockSaveDraftToServer = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    useLoanApplicationStore.mockReturnValue({
      draft: { documents: [] },
      updateDocuments: mockUpdateDocuments,
      nextStep: mockNextStep,
      previousStep: mockPreviousStep,
      saveDraftToServer: mockSaveDraftToServer,
    });
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });
  test('renders document upload form with required documents', () => {
    render(<DocumentsUpload />);
    expect(screen.getByText('Documents Upload')).toBeInTheDocument();
    expect(screen.getByText('ID Proof')).toBeInTheDocument();
    expect(screen.getByText('Income Proof')).toBeInTheDocument();
    expect(screen.getByText('Recent Pay Stubs')).toBeInTheDocument();
    expect(screen.getByText('Bank Statements')).toBeInTheDocument();
  });
  test('handles file upload successfully', async () => {
    const { container } = render(<DocumentsUpload />);
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = container.querySelector('#idProof');
    fireEvent.change(input, { target: { files: [file] } });
    // Wait for the 1-second upload delay in the component
    await waitFor(
      () => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
  test('prevents submission when required documents are missing', () => {
    render(<DocumentsUpload />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    // Button should be disabled when required documents are missing
    expect(nextButton).toBeDisabled();
    expect(mockNextStep).not.toHaveBeenCalled();
  });
  test('calls previousStep when Previous button is clicked', () => {
    render(<DocumentsUpload />);
    const previousButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(previousButton);
    expect(mockPreviousStep).toHaveBeenCalled();
  });
  test('saves draft successfully', async () => {
    render(<DocumentsUpload />);
    const saveDraftButton = screen.getByRole('button', { name: /save draft/i });
    fireEvent.click(saveDraftButton);
    await waitFor(() => {
      expect(mockSaveDraftToServer).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Draft saved successfully!');
    });
  });
  test('rejects files larger than 5MB', async () => {
    const { container } = render(<DocumentsUpload />);
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const input = container.querySelector('#idProof');
    fireEvent.change(input, { target: { files: [largeFile] } });
    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith('File size must be less than 5MB');
    });
  });
});
