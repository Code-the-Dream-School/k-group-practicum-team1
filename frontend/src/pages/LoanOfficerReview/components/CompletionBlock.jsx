import React from 'react';
import PropTypes from 'prop-types';
import { HiCheck, HiChevronRight, HiMiniXMark } from 'react-icons/hi2';

const CompletionBlock = ({ label, checked, onClick, reviewComplete }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border-2 transition cursor-pointer group ${
        checked
          ? 'border-none bg-green-50 hover:bg-green-100'
          : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition ${
            checked
              ? 'border-green-500 bg-green-500'
              : reviewComplete
                ? 'border-red-500 bg-red-500'
                : 'border-gray-300 bg-white group-hover:border-blue-400'
          }`}
        >
          {checked && <HiCheck className="w-3.5 h-3.5 text-white" />}
          {reviewComplete && !checked && <HiMiniXMark className="w-3.5 h-3.5 text-white" />}
        </div>
        <span
          className={`text-sm font-medium ${checked ? 'text-green-700' : reviewComplete ? 'text-red-700' : 'text-gray-700'}`}
        >
          {label}
        </span>
      </div>
      <HiChevronRight
        className={`w-4 h-4 transition ${checked ? 'text-green-500' : reviewComplete ? 'text-red-500' : 'text-gray-400 group-hover:text-blue-500'}`}
      />
    </button>
  );
};

CompletionBlock.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  reviewComplete: PropTypes.bool.isRequired,
};

export default CompletionBlock;
