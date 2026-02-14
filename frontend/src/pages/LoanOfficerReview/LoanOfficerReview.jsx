import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import humps from 'humps';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { formatDateToUS } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/currencyHelpers';
import { getStatusBadgeClass, formatStatus } from '../../utils/statusHelpers';
import CompletionBlock from './components/CompletionBlock';
import PersonalInfoModal from './components/PersonalInfoModal';
import VehicleInfoModal from './components/VehicleInfoModal';
import FinancialInfoModal from './components/FinancialInfoModal';
import DocumentsModal from './components/DocumentsModal';
import CreditCheckModal from './components/CreditCheckModal';

const LoanOfficerReview = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState(null);

  if (!appId) {
    throw new Error('Application ID is required to review the application');
  }

  const [criteria, setCriteria] = useState('yes');
  const [completenessValues, setCompletenessValues] = useState({
    personal: false,
    vehicle: false,
    financial: false,
    documents: false,
    creditCheck: false,
  });

  const [activeModal, setActiveModal] = useState(null);

  const isAllComplete = Object.values(completenessValues).every(Boolean);
  const reviewComplete = applicationData?.status === 'approved' || applicationData?.status === 'rejected';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      reviewNote: applicationData?.application_review?.reviewNotes || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchApplicationData = async () => {
      const response = await apiFetch(`/api/v1/applications/${appId}`, {
        method: 'GET',
      });
      if (response.data) {
        setApplicationData(humps.camelizeKeys(response.data));
        setCompletenessValues({
          personal: response.data?.application_review?.personal_info_complete ?? false,
          vehicle: response.data?.application_review?.vehicle_info_complete ?? false,
          financial: response.data?.application_review?.financial_info_complete ?? false,
          documents: response.data?.application_review?.documents_complete ?? false,
          creditCheck: response.data?.application_review?.credit_check_authorized ?? false,
        });
      } else {
        console.error('Failed to fetch application data');
      }
    };

    fetchApplicationData();
  }, [appId]);

  useEffect(() => {
    if (applicationData && reviewComplete) {
      setValue('reviewNote', applicationData.applicationReview?.reviewNotes || '');
    } else {
      setValue('reviewNote', '');
    }
  }, [applicationData, setValue, reviewComplete]);

  const handleCompletenessReview = async (fieldName) => {
    const updatedValues = {
      ...completenessValues,
      [fieldName]: true,
    };

    setCompletenessValues(updatedValues);
    setActiveModal(null);

    try {
      const response = await apiFetch(`/api/v1/applications/${appId}/review`, {
        method: 'PATCH',
        body: JSON.stringify({
          personal_info_complete: updatedValues.personal,
          vehicle_info_complete: updatedValues.vehicle,
          financial_info_complete: updatedValues.financial,
          documents_complete: updatedValues.documents,
          credit_check_authorized: updatedValues.creditCheck,
        }),
      });

      if (response.data) {
        setApplicationData((prevData) => ({
          ...prevData,
          applicationReview: {
            ...prevData.applicationReview,
            ...{
              id: response.data.id,
              personalInfoComplete: response.data.personal_info_complete,
              vehicleInfoComplete: response.data.vehicle_info_complete,
              financialInfoComplete: response.data.financial_info_complete,
              documentsComplete: response.data.documents_complete,
              creditCheckAuthorized: response.data.credit_check_authorized,
            },
          },
        }));

        if (fieldName === 'documents' && applicationData?.status?.includes('pending_documents')) {
          await apiFetch(`/api/v1/applications/${appId}`, {
            method: 'PATCH',
            body: JSON.stringify(
              humps.decamelizeKeys({
                ...applicationData,
                status: 'pending',
              })
            ),
          });

          setApplicationData((prevData) => ({
            ...prevData,
            status: 'pending',
          }));
        }
      }
    } catch (error) {
      console.error('Failed to update completeness values:', error);
    }
  };

  const handleRequestDocuments = async () => {
    try {
      const response = await apiFetch(`/api/v1/applications/${appId}`, {
        method: 'PATCH',
        body: JSON.stringify(
          humps.decamelizeKeys({
            ...applicationData,
            status: 'pending_documents',
          })
        ),
      });

      if (response.data) {
        setApplicationData((prevData) => ({
          ...prevData,
          status: 'pending_documents',
        }));
        setActiveModal(null);
      }
    } catch (error) {
      console.error('Failed to request documents:', error);
    }
  };

  const computeCompleteness = () => {
    return Math.round(
      (Object.values(completenessValues).filter(Boolean).length / Object.values(completenessValues).length) * 100
    );
  };

  const onSubmit = async (formData) => {
    const response = await apiFetch(`/api/v1/applications/${appId}`, {
      method: 'PATCH',
      body: JSON.stringify(
        humps.decamelizeKeys({
          id: applicationData.id,
          applicationReviewAttributes: {
            ...(applicationData?.applicationReview?.id ? { id: applicationData.applicationReview.id } : {}),
            reviewNotes: formData?.reviewNote,
          },
          status: criteria === 'yes' ? 'approved' : criteria === 'no' ? 'rejected' : 'under_review',
        })
      ),
    });

    if (response.data) {
      navigate('/dashboard');
    } else {
      console.error('Failed to submit application decision');
    }
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
                      ? `${applicationData.vehicle.year} ${applicationData.vehicle.make} ${applicationData.vehicle.model} ${applicationData.vehicle.trim ?? ''}`
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
              <h2 className="text-gray-600 text-xl font-bold mb-2">Completeness Review</h2>
              <div className="flex flex-col gap-3">
                <CompletionBlock
                  label="Personal Information"
                  checked={completenessValues.personal}
                  onClick={() => setActiveModal('personal')}
                  reviewComplete={reviewComplete}
                />
                <CompletionBlock
                  label="Vehicle Information"
                  checked={completenessValues.vehicle}
                  onClick={() => setActiveModal('vehicle')}
                  reviewComplete={reviewComplete}
                />
                <CompletionBlock
                  label="Financial Information"
                  checked={completenessValues.financial}
                  onClick={() => setActiveModal('financial')}
                  reviewComplete={reviewComplete}
                />
                <CompletionBlock
                  label="Documents Uploaded"
                  checked={completenessValues.documents}
                  onClick={() => setActiveModal('documents')}
                  reviewComplete={reviewComplete}
                />
                <CompletionBlock
                  label="Credit Check Authorized"
                  checked={completenessValues.creditCheck}
                  onClick={() => setActiveModal('creditCheck')}
                  reviewComplete={reviewComplete}
                />
              </div>
              <hr className="my-6 border-t border-0 w-full border-gray-300 " />
            </div>

            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Eligibility Assessment</h2>
              <div className="flex gap-4 flex-col">
                {!reviewComplete && (
                  <>
                    <h2>Meets Lending Criteria?</h2>
                    <select
                      value={criteria}
                      onChange={(e) => setCriteria(e.target.value)}
                      className="w-full bg-white border border-gray-300 text-gray-600  rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                    >
                      <option value="yes">Yes - Eligible</option>
                      <option value="no">No - Denied</option>
                      <option value="underwriting">Send to Underwriting</option>
                    </select>
                  </>
                )}
                <h2>Officer Notes</h2>
                <textarea
                  {...register('reviewNote', { required: 'Review note is required' })}
                  rows={4}
                  disabled={reviewComplete}
                  placeholder="Add any observations or concerns..."
                  className="w-full bg-white border border-gray-300 text-gray-800  rounded-lg px-3 py-2 focus:outline-none cursor-auto"
                />
                {errors.reviewNote && <p className="text-red-600 text-sm mt-1">{errors.reviewNote.message}</p>}
              </div>
            </div>
            <div className="flex flex-wrap justify-between ">
              <button
                className="  bg-gray-700 text-white  py-2 px-4 rounded-lg transition shadow-lg cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                Back To Dashboard
              </button>
              {!reviewComplete && (
                <button
                  disabled={criteria === 'yes' && !isAllComplete}
                  className={`py-2 px-4 rounded-lg transition shadow-lg text-white ${
                    criteria === 'yes' && !isAllComplete
                      ? 'bg-gray-400 cursor-not-allowed opacity-60'
                      : `cursor-pointer ${
                          criteria === 'yes' ? 'bg-green-700' : criteria === 'no' ? 'bg-red-700' : 'bg-blue-700'
                        }`
                  }`}
                  onClick={handleSubmit(onSubmit)}
                >
                  {criteria === 'yes' ? 'Approve Loan' : criteria === 'no' ? 'Reject Loan' : 'Send to Underwriting'}
                </button>
              )}
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

        <PersonalInfoModal
          isOpen={activeModal === 'personal'}
          onClose={() => setActiveModal(null)}
          onReview={() => handleCompletenessReview('personal')}
          applicationData={applicationData}
          isComplete={completenessValues.personal}
          reviewComplete={reviewComplete}
        />
        <VehicleInfoModal
          isOpen={activeModal === 'vehicle'}
          onClose={() => setActiveModal(null)}
          onReview={() => handleCompletenessReview('vehicle')}
          applicationData={applicationData}
          isComplete={completenessValues.vehicle}
          reviewComplete={reviewComplete}
        />
        <FinancialInfoModal
          isOpen={activeModal === 'financial'}
          onClose={() => setActiveModal(null)}
          onReview={() => handleCompletenessReview('financial')}
          applicationData={applicationData}
          isComplete={completenessValues.financial}
          reviewComplete={reviewComplete}
        />
        <DocumentsModal
          isOpen={activeModal === 'documents'}
          onClose={() => setActiveModal(null)}
          onReview={() => handleCompletenessReview('documents')}
          onRequestDocuments={handleRequestDocuments}
          applicationData={applicationData}
          isComplete={completenessValues.documents}
          reviewComplete={reviewComplete}
        />
        <CreditCheckModal
          isOpen={activeModal === 'creditCheck'}
          onClose={() => setActiveModal(null)}
          onReview={() => handleCompletenessReview('creditCheck')}
          applicationData={applicationData}
          isComplete={completenessValues.creditCheck}
          reviewComplete={reviewComplete}
        />
      </div>
    </div>
  );
};

export default LoanOfficerReview;
