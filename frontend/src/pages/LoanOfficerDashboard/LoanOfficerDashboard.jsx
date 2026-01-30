import React, { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { IoCloudUploadOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { FaRegHourglassHalf } from 'react-icons/fa6';

import Paginator from '../../components/Paginator/Paginator';
function LoanOfficerDashboard() {
  const loanData = [
    {
      applicationId: 1,
      applicant: 'John Doe',
      vehicle: '2024 honda Civic EX',
      loanAmount: '25000',
      term: '48',
      status: 'Submitted',
      completeness: 0,
      actions: 'Review',
    },
    {
      applicationId: 2,
      applicant: 'Jane Smith',
      vehicle: '2023 Toyota Camry',
      loanAmount: '22000',
      term: '48',
      status: 'Pending Documents',
      completeness: 60,
      actions: 'Request Docs',
    },
    {
      applicationId: 3,
      applicant: 'Michael Johnson',
      vehicle: '2024 Ford F-150',
      loanAmount: '35000',
      term: '48',
      status: 'Pending',
      completeness: 70,
      actions: 'Review',
    },
    {
      applicationId: 4,
      applicant: 'John Doe',
      vehicle: '2024 honda Civic EX',
      loanAmount: '25000',
      term: '48',
      status: 'Submitted',
      completeness: 0,
      actions: 'Review',
    },
    {
      applicationId: 5,
      applicant: 'Jane Smith',
      vehicle: '2023 Toyota Camry',
      loanAmount: '22000',
      term: '48',
      status: 'Pending Documents',
      completeness: 60,
      actions: 'Request Docs',
    },
    {
      applicationId: 6,
      applicant: 'Michael Johnson',
      vehicle: '2024 Ford F-150',
      loanAmount: '35000',
      term: '48',
      status: 'Pending',
      completeness: 70,
      actions: 'Review',
    },
    {
      applicationId: 7,
      applicant: 'John Doe',
      vehicle: '2024 honda Civic EX',
      loanAmount: '25000',
      term: '48',
      status: 'Submitted',
      completeness: 0,
      actions: 'Review',
    },
    {
      applicationId: 8,
      applicant: 'Jane Smith',
      vehicle: '2023 Toyota Camry',
      loanAmount: '22000',
      term: '48',
      status: 'Pending Documents',
      completeness: 60,
      actions: 'Request Docs',
    },
    {
      applicationId: 9,
      applicant: 'Michael Johnson',
      vehicle: '2024 Ford F-150',
      loanAmount: '35000',
      term: '48',
      status: 'Pending',
      completeness: 70,
      actions: 'Review',
    },
    {
      applicationId: 10,
      applicant: 'John Doe',
      vehicle: '2024 honda Civic EX',
      loanAmount: '25000',
      term: '48',
      status: 'Submitted',
      completeness: 0,
      actions: 'Review',
    },
    {
      applicationId: 11,
      applicant: 'Jane Smith',
      vehicle: '2023 Toyota Camry',
      loanAmount: '22000',
      term: '48',
      status: 'Pending Documents',
      completeness: 60,
      actions: 'Request Docs',
    },
    {
      applicationId: 12,
      applicant: 'Michael Johnson',
      vehicle: '2024 Ford F-150',
      loanAmount: '35000',
      term: '48',
      status: 'Pending',
      completeness: 70,
      actions: 'Review',
    },
    {
      applicationId: 13,
      applicant: 'John Doe',
      vehicle: '2024 honda Civic EX',
      loanAmount: '25000',
      term: '48',
      status: 'Submitted',
      completeness: 0,
      actions: 'Review',
    },
    {
      applicationId: 14,
      applicant: 'Jane Smith',
      vehicle: '2023 Toyota Camry',
      loanAmount: '22000',
      term: '48',
      status: 'Pending Documents',
      completeness: 60,
      actions: 'Request Docs',
    },
    {
      applicationId: 15,
      applicant: 'Michael Johnson',
      vehicle: '2024 Ford F-150',
      loanAmount: '35000',
      term: '48',
      status: 'Pending',
      completeness: 70,
      actions: 'Review',
    },
    {
      applicationId: 16,
      applicant: 'John Doe',
      vehicle: '2024 honda Civic EX',
      loanAmount: '25000',
      term: '48',
      status: 'Submitted',
      completeness: 0,
      actions: 'Review',
    },
    {
      applicationId: 17,
      applicant: 'Jane Smith',
      vehicle: '2023 Toyota Camry',
      loanAmount: '22000',
      term: '48',
      status: 'Pending Documents',
      completeness: 60,
      actions: 'Request Docs',
    },
    {
      applicationId: 18,
      applicant: 'Michael Johnson',
      vehicle: '2024 Ford F-150',
      loanAmount: '35000',
      term: '48',
      status: 'Pending',
      completeness: 70,
      actions: 'Review',
    },
    {
      applicationId: 19,
      applicant: 'John Doe',
      vehicle: '2024 honda Civic EX',
      loanAmount: '25000',
      term: '48',
      status: 'Submitted',
      completeness: 0,
      actions: 'Review',
    },
    {
      applicationId: 20,
      applicant: 'Jane Smith',
      vehicle: '2023 Toyota Camry',
      loanAmount: '22000',
      term: '48',
      status: 'Pending Documents',
      completeness: 60,
      actions: 'Request Docs',
    },
    {
      applicationId: 21,
      applicant: 'Michael Johnson',
      vehicle: '2024 Ford F-150',
      loanAmount: '35000',
      term: '48',
      status: 'Pending',
      completeness: 70,
      actions: 'Review',
    },
    {
      applicationId: 22,
      applicant: 'John Doe',
      vehicle: '2024 honda Civic EX',
      loanAmount: '25000',
      term: '48',
      status: 'Submitted',
      completeness: 0,
      actions: 'Review',
    },
    {
      applicationId: 23,
      applicant: 'Jane Smith',
      vehicle: '2023 Toyota Camry',
      loanAmount: '22000',
      term: '48',
      status: 'Pending Documents',
      completeness: 60,
      actions: 'Request Docs',
    },
    {
      applicationId: 24,
      applicant: 'Michael Johnson',
      vehicle: '2024 Ford F-150',
      loanAmount: '35000',
      term: '48',
      status: 'Pending',
      completeness: 70,
      actions: 'Review',
    },
  ];
  const itemsPerPage = 10;

  const [page, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(loanData.length / itemsPerPage);

  const start = page * itemsPerPage;
  const currentData = loanData.slice(start, start + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <section>
          <div className="">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-left">Loan Officer Dashboard</h1>
                <p className="text-gray-600">Review and manage loan applications</p>
              </div>
            </div>
            <div className="flex justify-between items-start mb-8 gap-6">
              <div className="w-full flex justify-between sm:w-1/4 sm:min-h-30 max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col items-start justify-between ">
                  <h2 className="text-gray-600">Submitted</h2>
                  <h1 className="font-bold text-2xl">8</h1>
                </div>
                <div className="flex items-center ">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="w-full flex justify-between sm:w-1/4 sm:min-h-30 max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col items-start justify-between ">
                  <h2 className="text-gray-600">Pending Documents</h2>
                  <h1 className="font-bold text-2xl">5</h1>
                </div>
                <div className="flex items-center ">
                  <IoCloudUploadOutline className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="w-full flex justify-between sm:w-1/4 sm:min-h-30 max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col items-start justify-between ">
                  <h2 className="text-gray-600">Pending</h2>
                  <h1 className="font-bold text-2xl">6</h1>
                </div>
                <div className="flex items-center ">
                  <FaRegHourglassHalf className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="w-full flex justify-between sm:w-1/4 sm:min-h-30 max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col items-start justify-between ">
                  <h2 className="text-gray-600">For Underwriting</h2>
                  <h1 className="font-bold text-2xl">4</h1>
                </div>
                <div className="flex items-center ">
                  <IoShieldCheckmarkOutline className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-between  items-start gap-4 bg-white shadow-lg rounded-lg mb-8 p-4">
          <input
            className=" w-full bg-white border border-gray-300 text-gray-600  rounded-lg px-3 py-2 focus:outline-none cursor-auto"
            type="text"
            placeholder="Search by applicant name or ID"
          />
          <select
            value={1}
            className="w-full bg-white border border-gray-300 text-gray-600  rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            placeholder="Search by applicant name or ID"
          />
          <select
            value={1}
            className="w-full bg-white border border-gray-300 text-gray-600  rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          />
          <button className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white  py-2 rounded-lg transition shadow-lg cursor-pointer">
            Apply
          </button>
        </section>
        <section className="min-h-[450px]">
          <h1>Applications Under Review</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Id
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completeness
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item.applicationId} className="hover:bg-gray-100 ">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 ">{item.applicationId}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.applicant}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.vehicle}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.loanAmount}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.term}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.status}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <div className="w-full bg-slate-100 rounded h-3 shadow-inner">
                        <div className="h-full rounded bg-blue-600 " style={{ width: `${item.completeness}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.actions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div>
          <div className="flex justify-center sm:px-2 ">
            <Paginator totalPages={totalPages} page={page} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanOfficerDashboard;
