/* eslint-disable react-hooks/incompatible-library */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';
import { formatCurrency } from '../../utils/currencyHelpers';

const ReviewAndSubmit = ({ viewOnly = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { draft, previousStep, loadDraftFromServer, saveDraftToServer, clearDraft } = useLoanApplicationStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      agreedToTerms: viewOnly || false,
    },
  });

  useEffect(() => {
    // Only load from server if viewing an existing application via URL id
    if (id && viewOnly) {
      loadDraftFromServer(id).catch((error) => {
        console.error('Failed to load application draft:', error);
        navigate('/dashboard');
      });
    }
  }, [id, viewOnly, navigate, loadDraftFromServer]);

  // Redirect if in viewOnly mode but application is still in draft status
  useEffect(() => {
    if (viewOnly && draft.status === 'draft') {
      console.warn('Cannot view draft application in viewOnly mode. Redirecting to dashboard.');
      navigate('/dashboard');
    }
  }, [viewOnly, draft.status, navigate]);

  const agreedToTerms = watch('agreedToTerms');

  const onSubmit = async () => {
    setIsSubmitting(true);

    saveDraftToServer()
      .then(async () => {
        alert('Application submitted successfully!');
        clearDraft();
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error submitting application:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handlePrevious = () => {
    previousStep();
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US');
  };

  const maskSSN = (ssn) => {
    if (!ssn) return 'N/A';
    return `***-**-${ssn.slice(-4)}`;
  };

  const getDocumentCount = () => {
    return draft.documentsAttributes?.length || 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      {viewOnly && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        {viewOnly ? 'Application Summary' : 'Review & Submit'}
      </h2>
      {viewOnly && (
        <div
          className={`mb-4 p-4 border rounded-lg ${
            draft.status === 'rejected'
              ? 'bg-red-50 border-red-200'
              : draft.status === 'approved'
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
          }`}
        >
          <p
            className={`font-medium ${
              draft.status === 'rejected'
                ? 'text-red-800'
                : draft.status === 'approved'
                  ? 'text-green-800'
                  : 'text-blue-800'
            }`}
          >
            {draft.status === 'approved'
              ? 'Application was approved'
              : draft.status === 'rejected'
                ? 'Application was rejected'
                : `Application was submitted on ${formatDate(draft.submittedDate)}`}
          </p>
        </div>
      )}
      {!viewOnly && (
        <p className="text-gray-600 mb-6">Please review all information before submitting your application.</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-base font-medium text-gray-900">
                {draft.personalInfoAttributes?.firstName} {draft.personalInfoAttributes?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-base font-medium text-gray-900">{draft.personalInfoAttributes?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-base font-medium text-gray-900">
                {formatPhoneNumber(draft.personalInfoAttributes?.phoneNumber)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="text-base font-medium text-gray-900">{formatDate(draft.personalInfoAttributes?.dob)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">SSN</p>
              <p className="text-base font-medium text-gray-900">{maskSSN(draft.personalInfoAttributes?.ssn)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="text-base font-medium text-gray-900">
                {draft.addressesAttributes?.[0]?.addressStreet || 'N/A'}
                {draft.addressesAttributes?.[0]?.city && `, ${draft.addressesAttributes[0]?.city}`}
                {draft.addressesAttributes?.[0]?.state && `, ${draft.addressesAttributes[0]?.state}`}
                {draft.addressesAttributes?.[0]?.zip && ` ${draft.addressesAttributes[0]?.zip}`}
              </p>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Year</p>
              <p className="text-base font-medium text-gray-900">{draft.vehicleAttributes?.year || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Make</p>
              <p className="text-base font-medium text-gray-900">{draft.vehicleAttributes?.make || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Model</p>
              <p className="text-base font-medium text-gray-900">{draft.vehicleAttributes?.model || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">VIN</p>
              <p className="text-base font-medium text-gray-900">{draft.vehicleAttributes?.vin || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mileage</p>
              <p className="text-base font-medium text-gray-900">
                {draft.vehicleAttributes?.mileage ? `${draft.vehicleAttributes.mileage.toLocaleString()} miles` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Condition</p>
              <p className="text-base font-medium text-gray-900 capitalize">
                {draft.vehicleAttributes?.vehicleType || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Employment Status</p>
              <p className="text-base font-medium text-gray-900 capitalize">
                {draft.financialInfoAttributes?.employmentStatus || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employer</p>
              <p className="text-base font-medium text-gray-900">{draft.financialInfoAttributes?.employer || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Job Title</p>
              <p className="text-base font-medium text-gray-900">{draft.financialInfoAttributes?.jobTitle || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Years Employed</p>
              <p className="text-base font-medium text-gray-900">
                {draft.financialInfoAttributes?.yearsEmployed || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Income</p>
              <p className="text-base font-medium text-gray-900">
                {formatCurrency(draft.financialInfoAttributes?.annualIncome)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Expenses</p>
              <p className="text-base font-medium text-gray-900">
                {formatCurrency(draft.financialInfoAttributes?.monthlyExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Loan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Purchase Price</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(draft.purchasePrice)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Down Payment</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(draft.downPayment)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loan Amount</p>
              <p className="text-base font-medium text-gray-900">{formatCurrency(draft.loanAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loan Term</p>
              <p className="text-base font-medium text-gray-900">
                {draft.termMonths ? `${draft.termMonths} months` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="text-base font-medium text-gray-900">{draft.apr ? `${draft.apr}%` : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Documents</h3>
          <div className="space-y-2">
            {getDocumentCount() > 0 ? (
              <>
                <p className="text-base text-gray-900">{getDocumentCount()} document(s) uploaded</p>
                <div className="mt-3 space-y-2">
                  {draft.documentsAttributes.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">
                        {doc.document_name} {': '} {doc.file_name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-base text-gray-500">No documents uploaded yet</p>
            )}
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              {...register('agreedToTerms', {
                required: 'You must agree to the terms and conditions to submit your application',
              })}
              disabled={viewOnly}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              {viewOnly ? (
                <span>I certify that I have reviewed all information in this application.</span>
              ) : (
                <span>
                  I certify that all information provided in this application is true and accurate to the best of my
                  knowledge. I understand that any false information may result in the denial of my application or
                  termination of my loan. I authorize the lender to verify the information provided and to obtain credit
                  reports as necessary for the evaluation of this application.
                </span>
              )}
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.agreedToTerms.message}
            </p>
          )}
        </div>

        {!viewOnly && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !agreedToTerms}
              className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

ReviewAndSubmit.propTypes = {
  viewOnly: PropTypes.bool,
};

export default ReviewAndSubmit;
