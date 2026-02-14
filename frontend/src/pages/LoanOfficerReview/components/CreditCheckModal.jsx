import React from 'react';
import ReviewModal from './ReviewModal';
import PropTypes from 'prop-types';
import {
  HiCheckBadge,
  HiExclamationTriangle,
  HiHandThumbUp,
  HiNoSymbol,
  HiOutlineChartBarSquare,
  HiOutlineDocumentMagnifyingGlass,
} from 'react-icons/hi2';

const CREDIT_SCORE_CONFIG = {
  excellent: { label: 'Excellent', range: '750–850', color: '#22c55e', angle: 157, Icon: HiCheckBadge },
  good: { label: 'Good', range: '700–749', color: '#84cc16', angle: 120, Icon: HiHandThumbUp },
  fair: { label: 'Fair', range: '650–699', color: '#eab308', angle: 75, Icon: HiExclamationTriangle },
  poor: { label: 'Poor', range: '300–649', color: '#ef4444', angle: 25, Icon: HiNoSymbol },
};

const CreditCheckModal = ({ isOpen, onClose, onReview, applicationData, isComplete, reviewComplete }) => {
  const creditScore = applicationData?.financialInfo?.creditScore;
  const config = CREDIT_SCORE_CONFIG[creditScore];
  const RatingIcon = config?.Icon;

  return (
    <ReviewModal
      isOpen={isOpen}
      onClose={onClose}
      onReview={onReview}
      title="Credit Check Authorization"
      isComplete={isComplete}
      reviewComplete={reviewComplete}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 flex items-center gap-2">
            <HiOutlineChartBarSquare className="w-4 h-4 text-indigo-500" />
            Credit Score Assessment
          </h3>

          {creditScore && config ? (
            <>
              <div
                className="w-full mt-4 rounded-lg p-4 border-1"
                style={{ borderColor: config.color, backgroundColor: `${config.color}10` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Credit Rating</p>
                    <p className="text-xl font-bold flex items-center gap-2" style={{ color: config.color }}>
                      {RatingIcon && <RatingIcon className="w-5 h-5" />} {config.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Score Range</p>
                    <p className="text-lg font-bold text-gray-700">{config.range}</p>
                  </div>
                </div>
              </div>

              <div className="w-full mt-4 bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-gray-600 mb-3">Risk Assessment</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Default Risk</span>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        creditScore === 'excellent' || creditScore === 'good'
                          ? 'bg-green-100 text-green-700'
                          : creditScore === 'fair'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {creditScore === 'excellent'
                        ? 'Very Low'
                        : creditScore === 'good'
                          ? 'Low'
                          : creditScore === 'fair'
                            ? 'Moderate'
                            : 'High'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Lending Recommendation</span>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        creditScore === 'excellent' || creditScore === 'good'
                          ? 'bg-green-100 text-green-700'
                          : creditScore === 'fair'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {creditScore === 'excellent'
                        ? 'Strongly Recommended'
                        : creditScore === 'good'
                          ? 'Recommended'
                          : creditScore === 'fair'
                            ? 'Review Required'
                            : 'Not Recommended'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
              <HiOutlineDocumentMagnifyingGlass className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">No Credit Score Reported</p>
              <p className="text-gray-400 text-sm mt-2">
                Credit information has not been provided or is unavailable for this applicant.
              </p>
            </div>
          )}
        </div>
      </div>
    </ReviewModal>
  );
};

CreditCheckModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  isComplete: PropTypes.bool,
  reviewComplete: PropTypes.bool,
  applicationData: PropTypes.shape({
    financialInfo: PropTypes.shape({
      creditScore: PropTypes.oneOf(['excellent', 'good', 'fair', 'poor']),
    }),
  }),
};

export default CreditCheckModal;
