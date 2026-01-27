import React, { useEffect } from 'react';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';
import Stepper from '../../components/Stepper/Stepper';
import PersonalInformation from '../../components/LoanApplication/PersonalInformation';
import VehicleInformation from '../../components/LoanApplication/VehicleInformation';

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
        return (
          <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Information</h2>
            <p className="text-gray-600">Financial information form coming soon...</p>
          </div>
        );
      case 4:
        return (
          <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Details</h2>
            <p className="text-gray-600">Loan details form coming soon...</p>
          </div>
        );
      case 5:
        return (
          <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Documents Upload</h2>
            <p className="text-gray-600">Documents upload form coming soon...</p>
          </div>
        );
      case 6:
        return (
          <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Review & Submit</h2>
            <p className="text-gray-600">Review form coming soon...</p>
          </div>
        );
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
