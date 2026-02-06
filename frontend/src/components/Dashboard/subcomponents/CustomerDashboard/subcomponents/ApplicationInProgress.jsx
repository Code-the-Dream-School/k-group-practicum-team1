import React, { useState, useEffect } from 'react';
import { HiCheck, HiClock, HiDocumentText } from 'react-icons/hi';
import humps from 'humps';
import Stepper from '../../../../Stepper/Stepper';
import { apiFetch } from '../../../../../services/api';
import { formatCurrency } from '../../../../../utils/currencyHelpers';
import { getStatusBadgeClass, formatStatus } from '../../../../../utils/statusHelpers';

// eslint-disable-next-line react/prop-types
const ApplicationInProgress = ({ applicationId }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!applicationId) {
    throw new Error('applicationId prop is required');
  }

  const statusInOrder = React.useMemo(
    () => ({ submitted: 1, pending: 2, pending_documents: 2, under_review: 3, approved: 4, rejected: 4 }),
    []
  );

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/api/v1/applications/${applicationId}`, {
          method: 'GET',
        });
        if (response.data && response.data) {
          setApplication(humps.camelizeKeys(response.data));
        } else {
          setApplication(null);
        }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

  const renderStatus = (message, textColor = 'text-gray-600') => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className={`text-center ${textColor}`}>{message}</div>
      </div>
    );
  };

  if (loading) {
    return renderStatus('Loading application details');
  }

  if (error) {
    return renderStatus(`Error: ${error}`, 'text-red-600');
  }

  if (!application) {
    return renderStatus('No application found.');
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{application.applicationNumber}</h3>
          <p className="text-gray-600 mt-1">{`${application?.vehicle.year} ${application?.vehicle.make} ${application?.vehicle.model}${application?.trim ? ` ${application.trim}` : ''}`}</p>
        </div>
        <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusBadgeClass(application?.status)}`}>
          <HiClock className="inline w-4 h-4 mr-1 -mt-0.5" />
          {formatStatus(application?.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div>
          <p className="text-gray-600 text-sm mb-1">Submitted</p>
          <p className="text-gray-900 text-xl font-bold">{formatDate(application?.submittedDate)}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-1">Loan Amount</p>
          <p className="text-gray-900 text-xl font-bold">
            {formatCurrency(application?.loanAmount, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-1">Term</p>
          <p className="text-gray-900 text-xl font-bold">
            {application?.termMonths ? `${application.termMonths} months` : '—'}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-1">APR</p>
          <p className="text-gray-900 text-xl font-bold">{application.apr ? `${application.apr}%` : '—'}</p>
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
