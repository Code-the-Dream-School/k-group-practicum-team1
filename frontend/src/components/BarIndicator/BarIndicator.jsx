import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/currencyHelpers';

const BarIndicator = ({ label, value, maxValue, color }) => {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-700">{formatCurrency(value || 0)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

BarIndicator.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  maxValue: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default BarIndicator;
