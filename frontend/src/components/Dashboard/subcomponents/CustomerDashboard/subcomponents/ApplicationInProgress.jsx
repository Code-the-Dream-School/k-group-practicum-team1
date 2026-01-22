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
        const mockScenarios = {
          1: {
            id: 1,
            application_number: 'AL-2024-001',
            vehicle: '2023 Toyota Camry',
            status: 'approved',
            submitted_date: '2024-01-15',
            loan_amount: 25000,
            term_months: 48,
            apr: 5.5,
          },
          2: {
            id: 2,
            application_number: 'AK-2024-002',
            vehicle: '2022 Honda Civic',
            status: 'under_review',
            submitted_date: '2024-01-10',
            loan_amount: 18500,
            term_months: 36,
            apr: 4.9,
          },
          3: {
            id: 3,
            application_number: 'FL-2024-003',
            vehicle: '2024 Ford F-150',
            status: 'pending',
            submitted_date: '2024-01-05',
            loan_amount: 35000,
            term_months: 60,
            apr: 6.2,
          },
          4: {
            id: 4,
            application_number: 'TX-2023-125',
            vehicle: '2021 Chevrolet Silverado',
            status: 'approved',
            submitted_date: '2023-11-20',
            loan_amount: 28000,
            term_months: 48,
            apr: 5.8,
          },
          5: {
            id: 5,
            application_number: 'CA-2023-089',
            vehicle: '2022 Nissan Altima',
            status: 'rejected',
            submitted_date: '2023-10-15',
            loan_amount: 21500,
            term_months: 36,
            apr: 7.2,
          },
          6: {
            id: 6,
            application_number: 'NY-2023-067',
            vehicle: '2023 Mazda CX-5',
            status: 'approved',
            submitted_date: '2023-09-05',
            loan_amount: 32000,
            term_months: 60,
            apr: 5.9,
          },
        };

        const mockData = mockScenarios[applicationId] || mockScenarios[1];

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
          <h3 className="text-xl font-bold text-gray-900">#{application.application_number}</h3>
          <p className="text-gray-600 mt-1">{application.vehicle}</p>
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
