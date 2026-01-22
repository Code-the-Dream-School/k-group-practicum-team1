import React from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiInbox } from 'react-icons/hi';

const NewApplication = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
        <HiInbox className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Pending Applications</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        You don&apos;t have any applications pending review at the moment.
      </p>
      <Link
        to="/applications/new"
        className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
      >
        <HiPlus className="w-5 h-5 mr-2" />
        Start a New Application
      </Link>
    </div>
  );
};

export default NewApplication;
