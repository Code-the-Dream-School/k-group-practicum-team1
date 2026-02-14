// frontend/src/components/LoanApplication/FinancialInformation.jsx
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

const FinancialInformation = () => {
  const { draft, updateFinancialInfoAttributes, nextStep, previousStep, saveDraftToServer } = useLoanApplicationStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    reset,
    getValues,
  } = useForm({
    defaultValues: draft.financialInfoAttributes || {},
    mode: 'onBlur',
  });

  const employmentStatusOptions = [
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'self-employed', label: 'Self-Employed' },
    { value: 'contract', label: 'Contract' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'retired', label: 'Retired' },
  ];

  const creditScoreOptions = [
    { value: 'excellent', label: 'Excellent (750+)' },
    { value: 'good', label: 'Good (700-749)' },
    { value: 'fair', label: 'Fair (650-699)' },
    { value: 'poor', label: 'Poor (Below 650)' },
  ];

  // Update form when draft changes
  useEffect(() => {
    reset(draft.financialInfoAttributes || {});
  }, [draft.financialInfoAttributes, reset]);

  const validatePositiveNumber = (value, fieldName, isOptional = false) => {
    if (!value) return isOptional ? true : `${fieldName} is required`;
    const num = parseFloat(value);
    return num >= 0 || `${fieldName} must be greater than or equal to 0`;
  };

  const validateYearsEmployed = (value) => {
    if (!value) return true; // Optional field
    const years = parseFloat(value);
    if (years < 0) return 'Years employed cannot be negative';
    if (years > 100) return 'Please enter a valid number of years';
    return true;
  };

  const handleSaveDraft = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    const formData = getValues();
    updateFinancialInfoAttributes(formData);
    try {
      await saveDraftToServer();
      toast.success('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please try again.');
    }
  };

  const onSubmit = (data) => {
    updateFinancialInfoAttributes(data);
    nextStep();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="employmentStatus" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Employment Status
            </label>
            <select
              id="employmentStatus"
              {...register('employmentStatus', { required: 'Employment status is required' })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select status</option>
              {employmentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.employmentStatus && <p className="mt-1 text-sm text-red-500">{errors.employmentStatus.message}</p>}
          </div>

          <div>
            <label htmlFor="employer" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Employer Name
            </label>
            <input
              type="text"
              id="employer"
              {...register('employer', {
                required: 'Employer name is required',
                minLength: {
                  value: 2,
                  message: 'Employer name must be at least 2 characters',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.employer ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter employer name"
            />
            {errors.employer && <p className="mt-1 text-sm text-red-500">{errors.employer.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="jobTitle" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              {...register('jobTitle', {
                required: 'Job title is required',
                minLength: {
                  value: 2,
                  message: 'Job title must be at least 2 characters',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.jobTitle ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter job title"
            />
            {errors.jobTitle && <p className="mt-1 text-sm text-red-500">{errors.jobTitle.message}</p>}
          </div>

          <div>
            <label htmlFor="yearsEmployed" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Years Employed
            </label>
            <input
              type="number"
              id="yearsEmployed"
              step="0.1"
              {...register('yearsEmployed', { validate: validateYearsEmployed })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.yearsEmployed ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 2.5"
            />
            {errors.yearsEmployed && <p className="mt-1 text-sm text-red-500">{errors.yearsEmployed.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="annualIncome" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Annual Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="annualIncome"
                step="0.01"
                {...register('annualIncome', {
                  validate: (value) => validatePositiveNumber(value, 'Annual income', true),
                })}
                className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.annualIncome ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="50000"
              />
            </div>
            {errors.annualIncome && <p className="mt-1 text-sm text-red-500">{errors.annualIncome.message}</p>}
          </div>

          <div>
            <label htmlFor="additionalIncome" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Additional Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="additionalIncome"
                step="0.01"
                {...register('additionalIncome', {
                  min: {
                    value: 0,
                    message: 'Additional income cannot be negative',
                  },
                })}
                className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.additionalIncome ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
            </div>
            {errors.additionalIncome && <p className="mt-1 text-sm text-red-500">{errors.additionalIncome.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="monthlyExpenses" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Monthly Expenses
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="monthlyExpenses"
                step="0.01"
                {...register('monthlyExpenses', {
                  validate: (value) => validatePositiveNumber(value, 'Monthly expenses', true),
                })}
                className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.monthlyExpenses ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2000"
              />
            </div>
            {errors.monthlyExpenses && <p className="mt-1 text-sm text-red-500">{errors.monthlyExpenses.message}</p>}
          </div>

          <div>
            <label htmlFor="creditScore" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Credit Score Estimate
            </label>
            <select
              id="creditScore"
              {...register('creditScore')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.creditScore ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select credit score range</option>
              {creditScoreOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.creditScore && <p className="mt-1 text-sm text-red-500">{errors.creditScore.message}</p>}
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={previousStep}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinancialInformation;
