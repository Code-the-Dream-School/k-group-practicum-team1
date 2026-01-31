import React, { useEffect } from 'react';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';
import Stepper from '../../components/Stepper/Stepper';
import PersonalInformation from '../../components/LoanApplication/PersonalInformation';
import VehicleInformation from '../../components/LoanApplication/VehicleInformation';
import FinancialInformation from '../../components/LoanApplication/FinancialInformation';
import LoanDetails from '../../components/LoanApplication/LoanDetails';
import DocumentsUpload from '../../components/LoanApplication/DocumentsUpload';
import ReviewAndSubmit from '../../components/LoanApplication/ReviewAndSubmit';

const NewApplicationPage = () => {
  const { currentStep, goToStep, clearDraft } = useLoanApplicationStore();

  // Reset state on first load
  useEffect(() => {
    clearDraft();
  }, [clearDraft]);

  const steps = [
    { label: 'Personal Details', icon: null },
    { label: 'Vehicle Details', icon: null },
    { label: 'Financial Information', icon: null },
    { label: 'Loan Details', icon: null },
    { label: 'Documents Upload', icon: null },
    { label: 'Review & Submit', icon: null },
  ];

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

export default NewApplicationPage;
