import React, { useEffect } from 'react';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';
import Stepper from '../../components/Stepper/Stepper';
import PersonalInformation from '../../components/LoanApplication/PersonalInformation';
import VehicleInformation from '../../components/LoanApplication/VehicleInformation';
import FinancialInformation from '../../components/LoanApplication/FinancialInformation';
import LoanDetails from '../../components/LoanApplication/LoanDetails';
import DocumentsUpload from '../../components/LoanApplication/DocumentsUpload';
import ReviewAndSubmit from '../../components/LoanApplication/ReviewAndSubmit';
import { STEPS } from '../../constants/stepperConstant';
import { getLatestAddress, getPersonalInfo } from '../../utils/personalInfo';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const NewApplicationPage = ({ isEditing }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentStep, goToStep, loadDraftFromServer, clearDraft } = useLoanApplicationStore();

  // Reset state on first load
  useEffect(() => {
    const prefillPersonalInfo = async () => {
      if (!id) {
        try {
          clearDraft();
          const personalInfo = await getPersonalInfo();
          const address = await getLatestAddress();
          if (personalInfo) {
            // Prefill Zustand store
            useLoanApplicationStore.getState().updatePersonalInfoAttributes(personalInfo);
            useLoanApplicationStore.getState().updateAddressesAttributes(address ? address : []);
          } else {
            clearDraft();
          }
        } catch (err) {
          console.error('Failed to prefill personal info:', err);
        }
      } else {
        clearDraft();
        loadDraftFromServer(id, isEditing).catch(() => {
          navigate('/dashboard');
        });
      }
    };
    prefillPersonalInfo();
  }, [clearDraft, id, isEditing, loadDraftFromServer, navigate]);

  const steps = STEPS;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInformation />;
      case 2:
        return <VehicleInformation />;
      case 3:
        return <FinancialInformation />;
      case 4:
        return <LoanDetails />;
      case 5:
        return <DocumentsUpload />;
      case 6:
        return <ReviewAndSubmit />;
      default:
        return <PersonalInformation />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auto Loan Application</h1>
          <p className="text-gray-600">Complete the form below to apply for an auto loan</p>
        </div>

        <div className="mb-8">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            title="Application Progress"
            progressTextType="step"
            onStepClick={(stepNumber) => goToStep(stepNumber)}
          />
        </div>

        <div>{renderStepContent()}</div>
      </div>
    </div>
  );
};

NewApplicationPage.propTypes = {
  isEditing: PropTypes.bool,
};

export default NewApplicationPage;
