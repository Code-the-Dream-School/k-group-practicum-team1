import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPencilAlt } from 'react-icons/hi';
import humps from 'humps';
import ApplicationHistory from './subcomponents/ApplicationHistory';
import ApplicationInProgress from './subcomponents/ApplicationInProgress';
import NewApplication from './subcomponents/NewApplication';
import { useAuth } from '../../../../context/AuthContext';
import { apiFetch } from '../../../../services/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/v1/applications', {
          method: 'GET',
        });

        if (response.data && Array.isArray(response.data.applications)) {
          setApplications(humps.camelizeKeys(response.data.applications));
        } else {
          setApplications([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => app.status.toLowerCase() !== 'draft');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-left">Welcome, {user?.first_name || 'User'}!</h1>
            <p className="text-gray-600">Here&apos;s an overview of your loan application</p>
          </div>
          <Link
            to="/application"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <HiPencilAlt className="w-5 h-5 mr-2" />
            New Application
          </Link>
        </div>

        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <NewApplication />
          ) : (
            <>
              <div className="mb-4 text-left">
                <h2 className="text-2xl font-bold text-gray-900">Applications in Progress</h2>
                <p className="text-gray-600">Track the status of your current applications</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredApplications.map((app) => (
                  <ApplicationInProgress applicationId={app.id} key={app.id} />
                ))}
              </div>
            </>
          )}
          <ApplicationHistory applications={applications} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
