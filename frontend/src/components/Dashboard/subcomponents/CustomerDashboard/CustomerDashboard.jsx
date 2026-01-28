import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPencilAlt } from 'react-icons/hi';
import ApplicationHistory from './subcomponents/ApplicationHistory';
import ApplicationInProgress from './subcomponents/ApplicationInProgress';
import NewApplication from './subcomponents/NewApplication';
import { useAuth } from '../../../../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        // const response = await fetch('/api/v1/applications');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch applications');
        // }
        // const data = await response.json();

        // Mock data for development - Remove when API is ready
        const mockData = [
          {
            id: 1,
            application_number: 'AK-2024-002',
            vehicle: '2022 Honda Civic',
            amount: 18500,
            created_at: '2024-01-10',
            status: 'under_review',
          },
          {
            id: 2,
            application_number: 'FL-2024-003',
            vehicle: '2024 Ford F-150',
            amount: 35000,
            created_at: '2024-01-05',
            status: 'pending',
          },
          {
            id: 3,
            application_number: 'TX-2023-125',
            vehicle: '2021 Chevrolet Silverado',
            amount: 28000,
            created_at: '2023-11-20',
            status: 'approved',
          },
        ];
        setApplications(mockData);
        // Uncomment below when API is ready
        // setApplications(data);
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
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Applications in Progress</h2>
                <p className="text-gray-600">Track the status of your current applications</p>
              </div>
              {filteredApplications.map((app) => (
                <ApplicationInProgress applicationId={app.id} key={app.id} />
              ))}
            </>
          )}
          <ApplicationHistory applications={applications} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
