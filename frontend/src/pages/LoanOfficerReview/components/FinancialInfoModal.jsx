import React from 'react';
import PropTypes from 'prop-types';
import {
  HiCheckCircle,
  HiOutlineBriefcase,
  HiOutlineChartBarSquare,
  HiOutlineCurrencyDollar,
  HiExclamationTriangle,
  HiXCircle,
} from 'react-icons/hi2';
import ReviewModal from './ReviewModal';
import { formatCurrency } from '../../../utils/currencyHelpers';
import GaugeChart from '../../../components/GaugeChart/GaugeChart';
import BarIndicator from '../../../components/BarIndicator/BarIndicator';

const InfoRow = ({ label, value }) => (
  <div className="py-2">
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-0.5 capitalize">{value || '—'}</p>
  </div>
);

const FinancialInfoModal = ({ isOpen, onClose, onReview, applicationData, isComplete, reviewComplete }) => {
  const financialInfo = applicationData?.financialInfo;

  const annualIncome = parseFloat(financialInfo?.annualIncome) || 0;
  const additionalIncome = parseFloat(financialInfo?.additionalIncome) || 0;
  const monthlyExpenses = parseFloat(financialInfo?.monthlyExpenses) || 0;
  const loanAmount = parseFloat(applicationData?.loanAmount) || 0;
  const vehicleValue =
    parseFloat(applicationData?.vehicle?.vehicleValue) || parseFloat(applicationData?.purchasePrice) || 0;
  const monthlyPayment = parseFloat(applicationData?.monthlyPayment) || 0;
  const totalMonthlyIncome = (annualIncome + additionalIncome) / 12;

  const ltvRatio = vehicleValue > 0 ? (loanAmount / vehicleValue) * 100 : 0;

  const totalMonthlyDebt = monthlyExpenses + monthlyPayment;
  const dtiRatio = totalMonthlyIncome > 0 ? (totalMonthlyDebt / totalMonthlyIncome) * 100 : 0;

  const ptiRatio = totalMonthlyIncome > 0 ? (monthlyPayment / totalMonthlyIncome) * 100 : 0;

  return (
    <ReviewModal
      isOpen={isOpen}
      onClose={onClose}
      onReview={onReview}
      title="Financial Information Review"
      isComplete={isComplete}
      reviewComplete={reviewComplete}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            <HiOutlineBriefcase className="w-4 h-4 text-blue-500" />
            Employment Details
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 bg-gray-50 rounded-lg p-4">
            <InfoRow label="Employment Status" value={financialInfo?.employmentStatus} />
            <InfoRow label="Employer" value={financialInfo?.employer} />
            <InfoRow label="Job Title" value={financialInfo?.jobTitle} />
            <InfoRow
              label="Years Employed"
              value={financialInfo?.yearsEmployed ? `${financialInfo.yearsEmployed} years` : null}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            <HiOutlineCurrencyDollar className="w-4 h-4 text-green-500" />
            Income & Expenses
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <BarIndicator
              label="Annual Income"
              value={annualIncome}
              maxValue={Math.max(annualIncome, additionalIncome, monthlyExpenses * 12) || 1}
              color="#22c55e"
            />
            <BarIndicator
              label="Additional Income"
              value={additionalIncome}
              maxValue={Math.max(annualIncome, additionalIncome, monthlyExpenses * 12) || 1}
              color="#3b82f6"
            />
            <BarIndicator
              label="Annual Expenses"
              value={monthlyExpenses * 12}
              maxValue={Math.max(annualIncome, additionalIncome, monthlyExpenses * 12) || 1}
              color="#ef4444"
            />
            <hr className="border-gray-300" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Monthly Disposable Income</span>
              <span className="font-bold text-green-700">{formatCurrency(totalMonthlyIncome - monthlyExpenses)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            <HiOutlineChartBarSquare className="w-4 h-4 text-indigo-500" />
            Key Financial Ratios
          </h3>
          <div className="flex justify-around rounded-lg p-4">
            <GaugeChart value={ltvRatio} max={150} label="Loan-to-Value (LTV)" suffix="%" />
            <GaugeChart value={dtiRatio} max={100} label="Debt-to-Income (DTI)" suffix="%" />
            <GaugeChart value={ptiRatio} max={100} label="Payment-to-Income (PTI)" suffix="%" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
              {ltvRatio <= 80 ? (
                <>
                  <HiCheckCircle className="w-4 h-4 text-green-500" /> Low Risk
                </>
              ) : ltvRatio <= 100 ? (
                <>
                  <HiExclamationTriangle className="w-4 h-4 text-yellow-500" /> Moderate Risk
                </>
              ) : (
                <>
                  <HiXCircle className="w-4 h-4 text-red-500" /> High Risk
                </>
              )}
            </div>
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
              {dtiRatio <= 36 ? (
                <>
                  <HiCheckCircle className="w-4 h-4 text-green-500" /> Low Risk
                </>
              ) : dtiRatio <= 50 ? (
                <>
                  <HiExclamationTriangle className="w-4 h-4 text-yellow-500" /> Moderate Risk
                </>
              ) : (
                <>
                  <HiXCircle className="w-4 h-4 text-red-500" /> High Risk
                </>
              )}
            </div>
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
              {ptiRatio <= 15 ? (
                <>
                  <HiCheckCircle className="w-4 h-4 text-green-500" /> Low Risk
                </>
              ) : ptiRatio <= 25 ? (
                <>
                  <HiExclamationTriangle className="w-4 h-4 text-yellow-500" /> Moderate Risk
                </>
              ) : (
                <>
                  <HiXCircle className="w-4 h-4 text-red-500" /> High Risk
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Loan Terms</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 bg-gray-50 rounded-lg p-4">
            <InfoRow label="Loan Amount" value={loanAmount ? formatCurrency(loanAmount) : null} />
            <InfoRow label="Term" value={applicationData?.termMonths ? `${applicationData.termMonths} months` : null} />
            <InfoRow label="APR" value={applicationData?.apr ? `${applicationData.apr}%` : null} />
            <InfoRow label="Monthly Payment" value={monthlyPayment ? formatCurrency(monthlyPayment) : null} />
          </div>
        </div>
      </div>
    </ReviewModal>
  );
};

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

FinancialInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  isComplete: PropTypes.bool,
  reviewComplete: PropTypes.bool,
  applicationData: PropTypes.shape({
    loanAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    purchasePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    monthlyPayment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    apr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    termMonths: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    financialInfo: PropTypes.shape({
      annualIncome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      additionalIncome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      monthlyExpenses: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      employmentStatus: PropTypes.string,
      employer: PropTypes.string,
      jobTitle: PropTypes.string,
      yearsEmployed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    vehicle: PropTypes.shape({
      vehicleValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

export default FinancialInfoModal;
