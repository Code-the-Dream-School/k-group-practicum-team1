import React, { useEffect, useState } from 'react';
import humps from 'humps';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { IoCloudUploadOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { FaRegHourglassHalf } from 'react-icons/fa6';
import { MdOutlinePendingActions } from 'react-icons/md';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { formatCurrency } from '../../../../utils/currencyHelpers';
import { formatStatus, getStatusBadgeClass } from '../../../../utils/statusHelpers';
import Paginator from '../../../Paginator/Paginator';
import { apiFetch } from '../../../../services/api';
import { formatDateToUS } from '../../../../utils/dateHelpers';

function LoanOfficerDashboard() {
  const [loanData, setLoanData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [applicantName, setApplicantName] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();

  const fetchLoanData = React.useCallback(
    async (sortBy = null, sortOrder = 'asc', filterApplicantName = '', filterStatus = '') => {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort_by', humps.decamelize(sortBy));
        params.append('sort_order', sortOrder);
      }
      if (filterApplicantName) {
        params.append('applicant_name', filterApplicantName);
      }
      if (filterStatus) {
        params.append('status', filterStatus);
      }
      const url = `/api/v1/applications${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiFetch(url, {
        method: 'GET',
      });
      setLoanData(response.data.applications.map((app) => humps.camelizeKeys(app)));
    },
    []
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLoanData();
  }, [fetchLoanData]);

  const itemsPerPage = 10;

  const [page, setCurrentPage] = useState(0);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    fetchLoanData(key, direction, applicantName, status);
  };

  const handleApply = () => {
    fetchLoanData(sortConfig.key, sortConfig.direction, applicantName, status);
  };

  const handleReset = () => {
    setApplicantName('');
    setStatus('');
    setSortConfig({ key: null, direction: 'asc' });
    fetchLoanData(null, 'asc', '', '');
  };

  const totalPages = Math.ceil(loanData.length / itemsPerPage);

  const start = page * itemsPerPage;
  const currentData = loanData.slice(start, start + itemsPerPage);

  const countSubmitted = loanData.filter((app) => app.status === 'submitted').length;
  const countPendingDocs = loanData.filter((app) => app.status === 'pending_documents').length;
  const countPending = loanData.filter((app) => app.status === 'pending').length;
  const countUnderwriting = loanData.filter((app) => app.status === 'under_review').length;

  console.log('Loan data fetched from server:', loanData);

  const computeCompleteness = (app) => {
    const completeness = app.applicationCompleteness;
    if (!completeness) return 0;
    const sections = Object.values(completeness);
    return Math.round((sections.filter(Boolean).length / sections.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <section>
          <div className="">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-1xl font-bold text-gray-700 mb-2 text-left">Loan Officer Dashboard</h1>
                <p className="text-gray-600">Review and manage loan applications</p>
              </div>
            </div>
            <div className="flex justify-between items-start mb-8 gap-6">
              <div className="w-full flex justify-between sm:w-1/4 sm:min-h-30 max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col items-start justify-between ">
                  <h2 className="text-gray-600">Submitted</h2>
                  <h1 className="font-bold text-2xl">{countSubmitted}</h1>
                </div>
                <div className="flex items-center ">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="w-full flex justify-between sm:w-1/4 sm:min-h-30 max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col items-start justify-between ">
                  <h2 className="text-gray-600">Pending Documents</h2>
                  <h1 className="font-bold text-2xl">{countPendingDocs}</h1>
                </div>
                <div className="flex items-center ">
                  <IoCloudUploadOutline className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="w-full flex justify-between sm:w-1/4 sm:min-h-30 max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col items-start justify-between ">
                  <h2 className="text-gray-600">Pending</h2>
                  <h1 className="font-bold text-2xl">{countPending}</h1>
                </div>
                <div className="flex items-center ">
                  <FaRegHourglassHalf className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="w-full flex justify-between sm:w-1/4 sm:min-h-30 max-w-xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col items-start justify-between ">
                  <h2 className="text-gray-600">For Underwriting</h2>
                  <h1 className="font-bold text-2xl">{countUnderwriting}</h1>
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
            placeholder="Search by applicant name"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-600  rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="" selected hidden>
              Filter by Status
            </option>
            <option value="submitted">Submitted</option>
            <option value="pending_documents">Pending documents</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
          </select>
          <button
            onClick={handleApply}
            className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white  py-2 rounded-lg transition shadow-lg cursor-pointer"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="w-1/3 bg-gray-600 hover:bg-gray-700 text-white  py-2 rounded-lg transition shadow-lg cursor-pointer"
          >
            Reset
          </button>
        </section>
        <section className="min-h-[460px]">
          <h1 className="text-gray-600 font-semibold text-xl my-5 ml-1">List of Applications</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('applicationNumber')}
                    className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Application Id
                      {sortConfig.key === 'applicationNumber' &&
                        (sortConfig.direction === 'asc' ? (
                          <HiArrowUp className="w-4 h-4" />
                        ) : (
                          <HiArrowDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('applicantName')}
                    className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Applicant
                      {sortConfig.key === 'applicantName' &&
                        (sortConfig.direction === 'asc' ? (
                          <HiArrowUp className="w-4 h-4" />
                        ) : (
                          <HiArrowDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('vehicle')}
                    className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Vehicle
                      {sortConfig.key === 'vehicle' &&
                        (sortConfig.direction === 'asc' ? (
                          <HiArrowUp className="w-4 h-4" />
                        ) : (
                          <HiArrowDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('loanAmount')}
                    className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Loan Amount
                      {sortConfig.key === 'loanAmount' &&
                        (sortConfig.direction === 'asc' ? (
                          <HiArrowUp className="w-4 h-4" />
                        ) : (
                          <HiArrowDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('submittedDate')}
                    className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Submitted Date
                      {sortConfig.key === 'submittedDate' &&
                        (sortConfig.direction === 'asc' ? (
                          <HiArrowUp className="w-4 h-4" />
                        ) : (
                          <HiArrowDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center gap-1">
                      Status
                      {sortConfig.key === 'status' &&
                        (sortConfig.direction === 'asc' ? (
                          <HiArrowUp className="w-4 h-4" />
                        ) : (
                          <HiArrowDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completeness
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item.applicationId} className="hover:bg-gray-100 ">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 ">{item.applicationNumber}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.applicantName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.vehicle}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(item.loanAmount)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {formatDateToUS(item.submittedDate)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(item.status)}`}>
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <div className="w-full bg-slate-100 rounded h-3 shadow-inner">
                        <div
                          className="h-full rounded bg-blue-600 "
                          style={{ width: `${computeCompleteness(item)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-md text-gray-700 flex items-center justify-center">
                      <MdOutlinePendingActions onClick={() => navigate(`/officer-review/${item.id}`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div>
          <div className="flex justify-center sm:px-2 sm:pt-4 ">
            <Paginator totalPages={totalPages} page={page} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanOfficerDashboard;
