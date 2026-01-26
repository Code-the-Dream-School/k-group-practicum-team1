// frontend/src/components/FormInput.test.jsx
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput } from './FormInput';

describe('FormInput', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    value: '',
    onChange: jest.fn(),
  };

  it('renders label and input correctly', () => {
    render(<FormInput {...defaultProps} />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    render(<FormInput {...defaultProps} value="test value" />);
    expect(screen.getByRole('textbox')).toHaveValue('test value');
  });

  it('calls onChange when input changes', () => {
    const handleChange = jest.fn();
    render(<FormInput {...defaultProps} onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies correct input type', () => {
    render(<FormInput {...defaultProps} type="email" />);
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'email');
  });

  it('renders placeholder when provided', () => {
    render(<FormInput {...defaultProps} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies required attribute when specified', () => {
    render(<FormInput {...defaultProps} required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('applies autoComplete attribute when provided', () => {
    render(<FormInput {...defaultProps} autoComplete="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
  });

  it('applies custom className to wrapper div', () => {
    const { container } = render(<FormInput {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('uses default mb-4 className when not specified', () => {
    const { container } = render(<FormInput {...defaultProps} />);
    expect(container.firstChild).toHaveClass('mb-4');
  });
});
