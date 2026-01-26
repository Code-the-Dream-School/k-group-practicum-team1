/* eslint-disable react/prop-types */
import React from 'react';
import { HiClock, HiEye } from 'react-icons/hi';

const ApplicationHistory = ({ applications, loading, error }) => {
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <HiClock className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Application History</h2>
        </div>
        <div className="text-center text-gray-600">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <HiClock className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Application History</h2>
        </div>
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <HiClock className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Application History</h2>
      </div>

      {applications.length === 0 ? (
        <div className="text-center text-gray-600 py-8">No application history found.</div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Application ID</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Vehicle</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Submitted Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">#{app.application_number || app.id}</td>
                    <td className="py-4 px-4 text-gray-700">{app.vehicle || 'N/A'}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium">{formatAmount(app.amount || 0)}</td>
                    <td className="py-4 px-4 text-gray-700">{formatDate(app.created_at || app.date)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(app.status)}`}>
                        {formatStatus(app.status || 'Pending')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => {
                          /* Navigate to application details */
                        }}
                        aria-label="View details"
                      >
                        <HiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Application ID</p>
                    <p className="font-medium text-gray-900">#{app.application_number || app.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(app.status)}`}>
                    {formatStatus(app.status || 'Pending')}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Vehicle</p>
                    <p className="text-gray-700">{app.vehicle || 'N/A'}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Amount</p>
                      <p className="text-gray-900 font-medium">{formatAmount(app.amount || 0)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">Submitted Date</p>
                      <p className="text-gray-700">{formatDate(app.created_at || app.date)}</p>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 transition-colors py-2 border-t border-gray-200 mt-3 pt-3"
                  onClick={() => {
                    /* Navigate to application details */
                  }}
                  aria-label="View details"
                >
                  <HiEye className="w-5 h-5" />
                  <span className="font-medium">View Details</span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationHistory;
