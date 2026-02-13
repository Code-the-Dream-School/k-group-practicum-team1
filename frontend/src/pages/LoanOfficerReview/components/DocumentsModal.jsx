import React from 'react';
import PropTypes from 'prop-types';
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineDocument,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiOutlinePlusCircle,
} from 'react-icons/hi2';
import ReviewModal from './ReviewModal';

const DocumentsModal = ({
  isOpen,
  onClose,
  onReview,
  onRequestDocuments,
  applicationData,
  isComplete,
  reviewComplete,
}) => {
  const documents = applicationData?.documents || [];

  const getFileIcon = (name) => {
    const ext = name?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) {
      return <HiOutlineDocumentText className="w-8 h-8 text-red-500" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <HiOutlinePhoto className="w-8 h-8 text-green-500" />;
    }
    return <HiOutlineDocument className="w-8 h-8 text-blue-500" />;
  };

  return (
    <ReviewModal
      isOpen={isOpen}
      onClose={onClose}
      onReview={onReview}
      title="Documents Review"
      isComplete={isComplete}
      reviewComplete={reviewComplete}
      extraActions={
        <button
          onClick={onRequestDocuments}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition shadow cursor-pointer flex items-center gap-2"
        >
          <HiOutlinePlusCircle className="w-4 h-4" />
          Request Documents
        </button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
            <HiOutlineDocumentText className="w-4 h-4 text-blue-500" />
            Uploaded Documents
          </h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
          </span>
        </div>

        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div
                key={doc.id || index}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition"
              >
                {getFileIcon(doc.documentName)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {doc.documentName || 'Unnamed Document'}
                  </p>
                  {doc.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{doc.description}</p>}
                </div>
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                  >
                    <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
            <HiOutlineDocumentMagnifyingGlass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">No documents uploaded yet</p>
            <p className="text-gray-300 text-xs mt-1">Documents are still in progress</p>
          </div>
        )}
      </div>
    </ReviewModal>
  );
};

DocumentsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
  onRequestDocuments: PropTypes.func.isRequired,
  isComplete: PropTypes.bool,
  reviewComplete: PropTypes.bool,
  applicationData: PropTypes.shape({
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        documentName: PropTypes.string,
        description: PropTypes.string,
        fileUrl: PropTypes.string,
      })
    ),
  }),
};

export default DocumentsModal;
