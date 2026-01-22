import React, { useState, useEffect } from 'react';
import { HiCheck, HiClock, HiDocumentText } from 'react-icons/hi';
import Stepper from '../../../../Stepper/Stepper';

// eslint-disable-next-line react/prop-types
const ApplicationInProgress = ({ applicationId }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!applicationId) {
    throw new Error('applicationId prop is required');
  }

  // Ordering of the statuses of the application
  const statusInOrder = React.useMemo(
    () => ({ submitted: 1, pending: 2, pending_documents: 2, under_review: 3, approved: 4, rejected: 4 }),
    []
  );

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      submitted: 'bg-blue-100 text-blue-800',
      pending: 'bg-blue-100 text-blue-800',
      pending_documents: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        // const response = await fetch(`/api/v1/applications/${applicationId}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch application');
        // }
        // const data = await response.json();

        // Mock data for development - Remove when API is ready
        const mockData = {
          id: applicationId,
          application_number: 'AL-2025-12345',
          status: 'submitted',
          submitted_date: '2025-12-01',
          loan_amount: 25000,
          term_months: 48,
          apr: 5.5,
        };

        setApplication(mockData);
        // Uncomment below when API is ready
        // setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId, statusInOrder]);

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
      amount
    );
  };

  const current_step = statusInOrder[application?.status] || 1;

  const applicationSteps = [
    {
      label: 'Submitted',
      icon: <HiCheck className="w-4 h-4" />,
    },
    {
      label: 'Pending',
      icon: <HiCheck className="w-4 h-4" />,
    },
    {
      label: 'Under Review',
      icon: <HiClock className="w-4 h-4" />,
      bgColor: application?.status === 'under_review' ? 'bg-yellow-500' : null,
    },
    {
      label: application?.status !== 'rejected' ? 'Approved' : 'Rejected',
      icon: <HiDocumentText className="w-4 h-4" />,
      bgColor:
        application?.status === 'approved' ? 'bg-green-600' : application?.status === 'rejected' ? 'bg-red-600' : null,
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center text-gray-600">Loading application details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center text-gray-600">No application found.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Application Status</h2>
          <p className="text-gray-600">Application #{application.application_number}</p>
        </div>
        <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusBadgeClass(application.status)}`}>
          <HiClock className="inline w-4 h-4 mr-1 -mt-0.5" />
          {formatStatus(application.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div>
          <p className="text-gray-600 text-sm mb-1">Submitted</p>
          <p className="text-gray-900 text-xl font-bold">{formatDate(application.submitted_date)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-1">Loan Amount</p>
          <p className="text-gray-900 text-xl font-bold">{formatAmount(application.loan_amount)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-1">Term</p>
          <p className="text-gray-900 text-xl font-bold">{application.term_months} months</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-1">APR</p>
          <p className="text-gray-900 text-xl font-bold">{application.apr}%</p>
        </div>
      </div>

      <Stepper
        steps={applicationSteps}
        currentStep={current_step}
        title="Application Progress"
        progressTextType="percentage"
        completedConfig={{
          icon: <HiCheck className="w-4 h-4" />,
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
        }}
      />
    </div>
  );
};

export default ApplicationInProgress;
