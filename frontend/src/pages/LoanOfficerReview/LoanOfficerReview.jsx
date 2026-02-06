import React, { useState, useEffect } from 'react';
import humps from 'humps';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { formatDateToUS } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/currencyHelpers';
import { getStatusBadgeClass, formatStatus } from '../../utils/statusHelpers';

function LoanOfficerReview() {
  const { appId } = useParams();
  const [applicationData, setApplicationData] = useState(null);

  if (!appId) {
    throw new Error('Application ID is required to review the application');
  }

  const [criteria, setCriteria] = useState('');
  const [completenessValues, setCompletenessValues] = useState({
    personal: false,
    vehicle: false,
    financial: false,
    documents: false,
    creditCheck: false,
  });

  useEffect(() => {
    const fetchApplicationData = async () => {
      const response = await apiFetch(`/api/v1/applications/${appId}`, {
        method: 'GET',
      });
      if (response.data) {
        setApplicationData(humps.camelizeKeys(response.data));
        setCompletenessValues({
          personal: response.data.application_review.personal_info_complete,
          vehicle: response.data.application_review.vehicle_info_complete,
          financial: response.data.application_review.financial_info_complete,
          documents: response.data.application_review.documents_complete,
          creditCheck: response.data.application_review.credit_check_authorized,
        });
      } else {
        console.error('Failed to fetch application data');
      }
    };

    fetchApplicationData();
  }, [appId]);

  const handleCompletenessUpdate = async (e) => {
    const { name, checked } = e.target;
    const updatedValues = {
      ...completenessValues,
      [name]: checked,
    };

    setCompletenessValues(updatedValues);

    try {
      await apiFetch(`/api/v1/applications/${appId}/review`, {
        method: 'PATCH',
        body: JSON.stringify({
          personal_info_complete: updatedValues.personal,
          vehicle_info_complete: updatedValues.vehicle,
          financial_info_complete: updatedValues.financial,
          documents_complete: updatedValues.documents,
          credit_check_authorized: updatedValues.creditCheck,
        }),
      });
    } catch (error) {
      console.error('Failed to update completeness values:', error);
    }
  };

  const computeCompleteness = () => {
    return Math.round(
      (Object.values(completenessValues).filter(Boolean).length / Object.values(completenessValues).length) * 100
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-2 text-left">Review Application</h1>
          <p className="text-gray-600">Application {applicationData ? applicationData.applicationNumber : ''}</p>
        </div>
        <section className="flex flex-row items-start justify-between gap-6">
          <div className="sm:w-3/4 flex flex-col bg-white shadow-lg rounded-lg p-5 gap-5 ">
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Personal Information</h2>
              <div className="flex flex-wrap">
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Full name</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.personalInfo
                      ? `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`
                      : ''}
                  </h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Email</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.personalInfo ? applicationData.personalInfo.email : ''}
                  </h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal pt-2">Phone number</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.personalInfo ? applicationData.personalInfo.phoneNumber : ''}
                  </h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal pt-2">Date of Birth</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.personalInfo?.dob ? formatDateToUS(applicationData.personalInfo.dob) : ''}
                  </h2>
                </div>
                <hr className="mt-5 border-t border-0 w-full border-gray-300 " />
              </div>
            </div>
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Vehicle Details</h2>
              <div className="flex flex-wrap">
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Vehicle</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.vehicle
                      ? `${applicationData.vehicle.year} ${applicationData.vehicle.make} ${applicationData.vehicle.model} ${applicationData.vehicle.trim}`
                      : ''}
                  </h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">VIN</label>
                  <h2 className="text-gray-600 text-md font-bold">{applicationData?.vehicle?.vin ?? '-'}</h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal pt-2">Purchase Price</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.purchasePrice ? `${formatCurrency(applicationData.purchasePrice)}` : ''}
                  </h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal pt-2">Down Payment</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.downPayment ? `${formatCurrency(applicationData.downPayment)}` : ''}
                  </h2>
                </div>
                <hr className="mt-5 border-t border-0 w-full border-gray-300 " />
              </div>
            </div>
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Loan Details</h2>
              <div className="flex flex-wrap">
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Loan Amount</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.loanAmount ? `${formatCurrency(applicationData.loanAmount)}` : ''}
                  </h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Term</label>
                  <h2 className="text-gray-600 text-md font-bold">
                    {applicationData?.termMonths ? `${applicationData.termMonths} months` : ''}
                  </h2>
                </div>
                <hr className="mt-5 border-t border-0 w-full border-gray-300 " />
              </div>
            </div>
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Loan Details</h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="personal"
                    className="mr-2 cursor-pointer"
                    checked={completenessValues.personal}
                    onChange={handleCompletenessUpdate}
                  />
                  Personal Information
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="vehicle"
                    className="mr-2 cursor-pointer"
                    checked={completenessValues.vehicle}
                    onChange={handleCompletenessUpdate}
                  />
                  Vehicle Information
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="financial"
                    className="mr-2 cursor-pointer"
                    checked={completenessValues.financial}
                    onChange={handleCompletenessUpdate}
                  />
                  Financial Information
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="documents"
                    className="mr-2 cursor-pointer"
                    checked={completenessValues.documents}
                    onChange={handleCompletenessUpdate}
                  />
                  Documents Uploaded
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="creditCheck"
                    className="mr-2 cursor-pointer"
                    checked={completenessValues.creditCheck}
                    onChange={handleCompletenessUpdate}
                  />
                  Credit Check Authorized
                </label>
              </div>
              <hr className="my-6 border-t border-0 w-full border-gray-300 " />
            </div>
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Eligibility Assessment</h2>
              <div className="flex gap-4 flex-col">
                <h2>Meets Lending Criteria?</h2>
                <select
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-600  rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="yes" selected>
                    Yes - Eligible
                  </option>
                  <option value="no">No - Denied</option>
                </select>
                <h2>Officer Notes</h2>
                <textarea
                  rows={4}
                  placeholder="Add any observations or concerns..."
                  className="w-full bg-white border border-gray-300 text-gray-800  rounded-lg px-3 py-2 focus:outline-none cursor-auto"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-between ">
              <button className="  bg-gray-400 hover:bg-gray-500 text-white  py-2 px-4 rounded-lg transition shadow-lg cursor-pointer">
                Cancel
              </button>
              <button className="  bg-blue-600 hover:bg-blue-700 text-white  py-2 px-4 rounded-lg transition shadow-lg cursor-pointer">
                Save & Send to UnderWriting
              </button>
            </div>
          </div>
          <div className="sm:w-1/4 flex flex-col bg-white shadow-lg rounded-lg p-5 gap-1">
            <h2 className="text-gray-600 text-xl font-bold mb-2">Application Status</h2>
            <h3 className="text-gray-500 text-md font-normal">Current Status</h3>
            <p className="px-2 text-center text-gray-800 ">
              {applicationData?.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(applicationData?.status)}`}
                >
                  {formatStatus(applicationData?.status)}
                </span>
              )}
            </p>
            <h3 className="text-gray-500 text-md font-normal">Submitted Date</h3>
            <p className="text-gray-600 text-md font-bold">{formatDateToUS(applicationData?.submittedDate)}</p>
            <h3 className="text-gray-500 text-md font-normal">Last Updated</h3>
            <p className="text-gray-600 text-md font-bold">
              {formatDateToUS(applicationData?.lastUpdatedAt?.split('T')?.[0])}
            </p>
            <h3 className="text-gray-500 text-md font-normal">Completeness</h3>
            <div className="w-full bg-slate-100 rounded h-3 shadow-inner">
              <div className="h-full rounded bg-blue-600 " style={{ width: `${computeCompleteness()}%` }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoanOfficerReview;
