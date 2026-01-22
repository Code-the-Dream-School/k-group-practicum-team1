import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPencilAlt } from 'react-icons/hi';
import ApplicationHistory from './subcomponents/ApplicationHistory';
import ApplicationInProgress from './subcomponents/ApplicationInProgress';
import NewApplication from './subcomponents/NewApplication';

const CustomerDashboard = () => {
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

        // Mock data for development
        const mockData = [
          {
            id: 1,
            application_number: 'AL-2024-001',
            vehicle: '2023 Toyota Camry',
            amount: 25000,
            created_at: '2024-01-15',
            status: 'approved',
          },
          {
            id: 2,
            application_number: 'AK-2024-002',
            vehicle: '2022 Honda Civic',
            amount: 18500,
            created_at: '2024-01-10',
            status: 'under_review',
          },
          {
            id: 3,
            application_number: 'FL-2024-003',
            vehicle: '2024 Ford F-150',
            amount: 35000,
            created_at: '2024-01-05',
            status: 'pending',
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-left">Welcome, John!</h1>
            <p className="text-gray-600">Here&apos;s an overview of your loan application</p>
          </div>
          <Link
            to="/applications/new"
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
            filteredApplications.map((app) => <ApplicationInProgress applicationId={app.id} key={app.id} />)
          )}
          <ApplicationHistory applications={applications} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
