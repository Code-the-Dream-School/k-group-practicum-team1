import React from 'react';
import PropTypes from 'prop-types';
// import { HiOutlineTruck } from 'react-icons/hi2';
import ReviewModal from './ReviewModal';
import { formatCurrency } from '../../../utils/currencyHelpers';

const InfoRow = ({ label, value }) => (
  <div className="py-2">
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || '—'}</p>
  </div>
);

const formatVehicleType = (type) => {
  if (!type) return '—';
  return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const VehicleInfoModal = ({ isOpen, onClose, onReview, applicationData, isComplete, reviewComplete }) => {
  const vehicle = applicationData?.vehicle;

  return (
    <ReviewModal
      isOpen={isOpen}
      onClose={onClose}
      onReview={onReview}
      title="Vehicle Information Review"
      isComplete={isComplete}
      reviewComplete={reviewComplete}
    >
      <div className="space-y-6">
        {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
          <div className="flex items-center gap-3 mb-1">
            <HiOutlineTruck className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">
              {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}` : 'No Vehicle Data'}
            </h3>
          </div>
          {vehicle && <p className="text-sm text-gray-500 ml-9">{formatVehicleType(vehicle.vehicleType)} Vehicle</p>}
        </div> */}

        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Vehicle Specifications</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 bg-gray-50 rounded-lg p-4">
            <InfoRow label="Type" value={formatVehicleType(vehicle?.vehicleType)} />
            <InfoRow label="Year" value={vehicle?.year} />
            <InfoRow label="Make" value={vehicle?.make} />
            <InfoRow label="Model" value={vehicle?.model} />
            <InfoRow label="Trim" value={vehicle?.trim} />
            <InfoRow label="VIN" value={vehicle?.vin} />
            <InfoRow label="Mileage" value={vehicle?.mileage ? `${vehicle.mileage.toLocaleString()} mi` : null} />
            <InfoRow
              label="Vehicle Value"
              value={applicationData?.purchasePrice ? formatCurrency(applicationData.purchasePrice) : null}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Purchase Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Purchase Price</span>
              <span className="text-sm font-bold text-gray-800">
                {applicationData?.purchasePrice ? formatCurrency(applicationData.purchasePrice) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Down Payment</span>
              <span className="text-sm font-bold text-gray-800">
                {applicationData?.downPayment ? formatCurrency(applicationData.downPayment) : '—'}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Loan Amount</span>
              <span className="text-sm font-bold text-blue-700">
                {applicationData?.loanAmount ? formatCurrency(applicationData.loanAmount) : '—'}
              </span>
            </div>
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

VehicleInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  isComplete: PropTypes.bool,
  reviewComplete: PropTypes.bool,
  applicationData: PropTypes.shape({
    purchasePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    downPayment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    loanAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    vehicle: PropTypes.shape({
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      make: PropTypes.string,
      model: PropTypes.string,
      trim: PropTypes.string,
      vin: PropTypes.string,
      mileage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      vehicleType: PropTypes.string,
      vehicleValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

export default VehicleInfoModal;
