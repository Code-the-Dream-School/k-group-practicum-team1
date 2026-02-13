import React from 'react';
import PropTypes from 'prop-types';

const GaugeChart = ({ value, max, label, suffix = '' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = '#0fb953';
  if (percentage > 75) color = '#f93939';
  else if (percentage > 50) color = '#ef8c0b';
  else if (percentage > 25) color = '#f7c632';

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-md">
        <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          transform="rotate(-90 60 60)"
        />

        <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold fill-gray-800">
          <tspan fontSize="18">{value.toFixed(1)}</tspan>
          <tspan fontSize="12" fill="#9ca3af">
            {suffix}
          </tspan>
        </text>
      </svg>

      <p className="text-xs text-gray-600 font-medium text-center">{label}</p>
    </div>
  );
};

GaugeChart.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  suffix: PropTypes.string,
};

export default GaugeChart;
