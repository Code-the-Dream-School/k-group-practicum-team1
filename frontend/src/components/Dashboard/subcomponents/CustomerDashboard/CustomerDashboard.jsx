import React from 'react';
import { Link } from 'react-router-dom';
import { HiPencilAlt } from 'react-icons/hi';
import PendingApplication from './subcomponents/PendingApplication';
import ApplicationHistory from './subcomponents/ApplicationHistory';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
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
          <PendingApplication />
          <ApplicationHistory />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
