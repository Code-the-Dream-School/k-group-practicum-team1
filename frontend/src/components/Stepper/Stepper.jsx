/* eslint-disable react/prop-types */
import React from 'react';

const Stepper = ({
  steps = [],
  currentStep = 1,
  title = 'Application Progress',
  progressTextType = 'step', // 'step' | 'percentage'
  completedConfig = {
    icon: null,
    bgColor: null,
    textColor: null,
  },
}) => {
  if (steps.length === 0) {
    throw new Error('Stepper component requires at least one step.');
  }

  const totalSteps = steps.length;
  const progressPercentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full bg-white px-4 py-6 rounded-lg shadow-sm font-sans">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-gray-600 font-medium text-sm">{title}</h2>
        <span className="text-gray-900 font-bold text-sm">
          {progressTextType === 'percentage'
            ? `${Math.round(progressPercentage)}%`
            : `Step ${currentStep} of ${totalSteps}`}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="relative flex justify-between items-start w-full">
        <div className="absolute top-4 left-0 w-full h-[1px] bg-gray-200 -z-0 -translate-y-1/2" />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          const isHighlighted = isActive || isCompleted;
          const backgroundColor = step.bgColor ? step.bgColor : isHighlighted ? 'bg-blue-600' : 'bg-slate-500';

          return (
            <div key={index} className="flex flex-col items-center justify-start relative z-10 w-24">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors duration-300 ${isCompleted ? completedConfig.bgColor || 'bg-blue-600' : backgroundColor} ${isCompleted ? completedConfig.textColor || 'text-white' : 'text-white'}`}
                style={step.bgColor && !step.bgColor.startsWith('bg-') ? { backgroundColor: step.bgColor } : {}}
              >
                {isCompleted && completedConfig.icon ? (
                  completedConfig.icon
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs text-center font-medium leading-tight ${step.textColor ? step.textColor : 'text-gray-800'}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
