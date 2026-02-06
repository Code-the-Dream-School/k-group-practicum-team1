/* eslint-disable react-hooks/incompatible-library */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';

const LoanDetails = () => {
  const { draft, updateLoanDetails, nextStep, previousStep, saveDraftToServer } = useLoanApplicationStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    trigger,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      termMonths: draft.loanDetails?.termMonths || '',
      downPayment: draft.vehicleAttributes?.downPayment || '',
    },
    mode: 'onChange',
  });

  const [monthlyPayment, setMonthlyPayment] = useState({
    principalAndInterest: 0,
    estimatedInsurance: 0,
    totalMonthly: 0,
  });

  const vehiclePrice = parseFloat(draft.vehicleAttributes?.purchasePrice || 0);
  const downPaymentInput = watch('downPayment');
  const downPayment = parseFloat(downPaymentInput || 0);
  const loanAmount = vehiclePrice - downPayment;

  const selectedLoanTerm = watch('termMonths');

  const loanTermOptions = React.useMemo(
    () => [
      { value: '24', months: 24, apr: 4.3, popular: false },
      { value: '36', months: 36, apr: 4.9, popular: false },
      { value: '48', months: 48, apr: 5.5, popular: true },
      { value: '60', months: 60, apr: 6.2, popular: false },
      { value: '72', months: 72, apr: 6.9, popular: false },
      { value: '84', months: 84, apr: 7.5, popular: false },
    ],
    []
  );

  const calculatePaymentForTerm = React.useCallback(
    (termMonths, apr) => {
      if (loanAmount <= 0) return 0;
      const monthlyRate = apr / 100 / 12;
      return (
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      );
    },
    [loanAmount]
  );

  const calculateInsurance = React.useCallback((vehiclePrice) => {
    if (vehiclePrice > 30000) return 250;
    if (vehiclePrice > 20000) return 200;
    return 150;
  }, []);

  useEffect(() => {
    if (selectedLoanTerm && loanAmount > 0) {
      const selectedOption = loanTermOptions.find((opt) => opt.value === selectedLoanTerm);
      if (selectedOption) {
        const principalAndInterest = calculatePaymentForTerm(selectedOption.months, selectedOption.apr);

        const estimatedInsurance = calculateInsurance(vehiclePrice);

        setMonthlyPayment({
          principalAndInterest: principalAndInterest,
          estimatedInsurance: estimatedInsurance,
          totalMonthly: principalAndInterest + estimatedInsurance,
        });
      }
    } else {
      setMonthlyPayment({
        principalAndInterest: 0,
        estimatedInsurance: 0,
        totalMonthly: 0,
      });
    }
  }, [selectedLoanTerm, loanAmount, vehiclePrice, loanTermOptions, calculatePaymentForTerm, calculateInsurance]);

  useEffect(() => {
    reset({
      termMonths: draft.loanDetails?.termMonths || '',
      downPayment: draft.vehicleAttributes?.downPayment || '',
    });
  }, [draft.loanDetails, draft.vehicleAttributes, reset]);

  const handleSaveDraft = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    const formData = getValues();
    updateLoanDetails({
      ...formData,
      downPayment: parseFloat(formData.downPayment),
      loanAmount: loanAmount,
      purchasePrice: vehiclePrice,
      apr: loanTermOptions.find((opt) => opt.value === formData.termMonths)?.apr,
      monthlyPayment: monthlyPayment.totalMonthly,
    });
    try {
      await saveDraftToServer();
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const onSubmit = (data) => {
    updateLoanDetails({
      ...data,
      downPayment: parseFloat(data.downPayment),
      loanAmount: loanAmount,
      purchasePrice: vehiclePrice,
      apr: loanTermOptions.find((opt) => opt.value === data.termMonths)?.apr,
      monthlyPayment: monthlyPayment.totalMonthly,
    });
    nextStep();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Details</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Purchase Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Vehicle Price</label>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(vehiclePrice)}</div>
            </div>
            <div>
              <label htmlFor="downPayment" className="block text-sm font-medium text-gray-600 mb-2">
                Down Payment <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  id="downPayment"
                  step="0.01"
                  min={0}
                  {...register('downPayment', {
                    required: 'Down payment is required',
                    min: {
                      value: 0,
                      message: 'Down payment cannot be negative',
                    },
                    max: {
                      value: vehiclePrice,
                      message: 'Down payment cannot exceed vehicle price',
                    },
                    validate: (value) => {
                      const dp = parseFloat(value);
                      if (isNaN(dp)) return 'Please enter a valid amount';
                      return true;
                    },
                  })}
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.downPayment ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.downPayment && <p className="mt-1 text-xs text-red-500">{errors.downPayment.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Loan Amount</label>
              <div className="text-xl font-bold text-blue-600">{formatCurrency(loanAmount)}</div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Loan Term:</h3>
          <input type="hidden" {...register('termMonths', { required: 'Please select a loan term' })} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loanTermOptions.map((option) => {
              const monthlyPaymentForTerm = calculatePaymentForTerm(option.months, option.apr);
              const totalPayment = monthlyPaymentForTerm * option.months;
              const isSelected = selectedLoanTerm === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    reset({ termMonths: option.value, downPayment: downPaymentInput });
                  }}
                  className={`relative p-6 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                      {option.months} Months
                    </div>
                    <div className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>{option.apr}% APR</div>
                    <div className={`text-3xl font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {formatCurrency(monthlyPaymentForTerm)}/mo
                    </div>
                    <div className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                      Total: {formatCurrency(totalPayment)}
                    </div>
                    {option.popular && (
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.termMonths && <p className="mt-2 text-sm text-red-500">{errors.termMonths.message}</p>}
        </div>

        {selectedLoanTerm && loanAmount > 0 && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estimated Monthly Payment</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                <span className="text-gray-700">Principal & Interest</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(monthlyPayment.principalAndInterest)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                <span className="text-gray-700">
                  Estimated Insurance
                  <span className="text-xs text-gray-500 block">Full coverage required</span>
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(monthlyPayment.estimatedInsurance)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300">
                <span className="text-lg font-bold text-gray-800">Total Monthly Payment</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyPayment.totalMonthly)}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-600">
              * This is an estimate. Actual rates and payment amounts will be determined after credit approval.
            </p>
          </div>
        )}
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
            disabled={!selectedLoanTerm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanDetails;
