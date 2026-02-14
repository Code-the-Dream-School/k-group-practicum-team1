import React from 'react';
import PropTypes from 'prop-types';
import { HiOutlineMapPin, HiOutlineUser } from 'react-icons/hi2';
import ReviewModal from './ReviewModal';
import { formatDateToUS } from '../../../utils/dateHelpers';

const InfoRow = ({ label, value }) => (
  <div className="py-2">
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || '—'}</p>
  </div>
);

const formatSSN = (ssn) => {
  if (!ssn) return '—';
  const masked = '•••-••-' + ssn.slice(-4);
  return masked;
};

const PersonalInfoModal = ({ isOpen, onClose, onReview, applicationData, isComplete, reviewComplete }) => {
  const personalInfo = applicationData?.personalInfo;
  const addresses = applicationData?.addresses || [];

  return (
    <ReviewModal
      isOpen={isOpen}
      onClose={onClose}
      onReview={onReview}
      title="Personal Information Review"
      isComplete={isComplete}
      reviewComplete={reviewComplete}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            <HiOutlineUser className="w-4 h-4 text-blue-500" />
            Applicant Details
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 bg-gray-50 rounded-lg p-4">
            <InfoRow label="First Name" value={personalInfo?.firstName} />
            <InfoRow label="Last Name" value={personalInfo?.lastName} />
            <InfoRow label="Email" value={personalInfo?.email} />
            <InfoRow label="Phone Number" value={personalInfo?.phoneNumber} />
            <InfoRow label="Date of Birth" value={personalInfo?.dob ? formatDateToUS(personalInfo.dob) : null} />
            <InfoRow label="SSN" value={formatSSN(personalInfo?.ssn)} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            <HiOutlineMapPin className="w-4 h-4 text-blue-500" />
            Address Information
          </h3>
          {addresses.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                <InfoRow label="Street" value={addresses[0].addressStreet} />
                <InfoRow label="City" value={addresses[0].city} />
                <InfoRow label="State" value={addresses[0].state} />
                <InfoRow label="ZIP Code" value={addresses[0].zip} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-400 text-sm">
              No address information provided
            </div>
          )}
        </div>
      </div>
    </ReviewModal>
  );
};

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

PersonalInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  isComplete: PropTypes.bool,
  reviewComplete: PropTypes.bool,
  applicationData: PropTypes.shape({
    personalInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      dob: PropTypes.string,
      ssn: PropTypes.string,
    }),
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        addressStreet: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zip: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }),
};

export default PersonalInfoModal;
