import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ReviewModal = ({ isOpen, onClose, onReview, title, children, extraActions, isComplete, reviewComplete }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="review-modal-title" className="text-xl font-bold text-gray-700">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer text-2xl leading-none"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {!isComplete && !reviewComplete && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex gap-2">{extraActions}</div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={onReview}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow cursor-pointer"
              >
                Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  extraActions: PropTypes.node,
  isComplete: PropTypes.bool,
  reviewComplete: PropTypes.bool,
};

export default ReviewModal;
