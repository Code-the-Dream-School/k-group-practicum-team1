// frontend/src/components/LoanApplication/DocumentsUpload.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';
import {
  REQUIRED_DOCUMENTS,
  OPTIONAL_DOCUMENTS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '../../constants/documentConstant';

const DocumentsUpload = () => {
  const { draft, updateDocuments, nextStep, previousStep, saveDraftToServer } = useLoanApplicationStore();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onChange',
  });

  const [uploadedDocuments, setUploadedDocuments] = useState(draft.documents || []);
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    return () => {
      uploadedDocuments.forEach((doc) => {
        if (doc.file_url && doc.file_url.startsWith('blob:')) {
          URL.revokeObjectURL(doc.file_url);
        }
      });
    };
  }, [uploadedDocuments]);

  const requiredDocuments = REQUIRED_DOCUMENTS;
  const optionalDocuments = OPTIONAL_DOCUMENTS;

  const handleFileChange = async (documentId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.warn(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      event.target.value = '';
      return;
    }

    setUploading((prev) => ({ ...prev, [documentId]: true }));

    // TODO: Replace with actual file upload to backend
    // Expected API endpoint: POST /api/v1/applications/:application_id/documents
    // Request body (multipart/form-data):
    // - file: File object
    // - document_name: Document type name
    // - description: Document description
    // Response should include: id, document_name, description, file_url, created_at, updated_at
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const docType = [...REQUIRED_DOCUMENTS, ...OPTIONAL_DOCUMENTS].find((doc) => doc.id === documentId);

    const existingDoc = uploadedDocuments.find((doc) => doc.id === documentId);
    if (existingDoc?.file_url && existingDoc.file_url.startsWith('blob:')) {
      URL.revokeObjectURL(existingDoc.file_url);
    }

    const newDocument = {
      id: documentId,
      document_name: docType?.name || file.name,
      description: docType?.description || '',
      file_url: URL.createObjectURL(file), // Temporary local URL for preview, will be replaced with backend URL after upload
      file: file, // Store the actual File object for uploading to backend
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      uploaded_at: new Date().toISOString(),
    };

    const updatedDocuments = [...uploadedDocuments.filter((doc) => doc.id !== documentId), newDocument];

    setUploadedDocuments(updatedDocuments);
    setUploading((prev) => ({ ...prev, [documentId]: false }));
  };

  const handleRemoveDocument = (documentId) => {
    const docToRemove = uploadedDocuments.find((doc) => doc.id === documentId);
    if (docToRemove?.file_url && docToRemove.file_url.startsWith('blob:')) {
      URL.revokeObjectURL(docToRemove.file_url);
    }
    const updatedDocuments = uploadedDocuments.filter((doc) => doc.id !== documentId);
    setUploadedDocuments(updatedDocuments);
  };

  const getDocumentStatus = (documentId) => {
    return uploadedDocuments.find((doc) => doc.id === documentId);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };
  const getDocumentFileName = (doc) => doc.file_name || doc.name;
  const getDocumentFileSize = (doc) => doc.file_size || doc.size;
  const allRequiredUploaded = () => {
    return requiredDocuments.every((doc) => getDocumentStatus(doc.id));
  };

  const onSubmit = async () => {
    if (!allRequiredUploaded()) {
      toast.warn('Please upload all required documents before continuing.');
      return;
    }

    updateDocuments(uploadedDocuments);
    nextStep();
  };

  const handleSaveDraft = async () => {
    updateDocuments(uploadedDocuments);
    await saveDraftToServer();
    toast.success('Draft saved successfully!');
  };

  const handlePrevious = () => {
    updateDocuments(uploadedDocuments);
    previousStep();
  };

  const renderDocumentCard = (doc) => {
    const uploadedDoc = getDocumentStatus(doc.id);
    const isUploading = uploading[doc.id];

    return (
      <div key={doc.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
              {doc.required && <span className="text-red-500 text-sm font-medium">*Required</span>}
              {!doc.required && <span className="text-gray-400 text-sm font-medium">(Optional)</span>}
            </div>
            <p className="text-sm text-gray-600">{doc.description}</p>
          </div>
          {uploadedDoc && (
            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {uploadedDoc ? (
          <div className="bg-white rounded-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <svg className="w-8 h-8 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{getDocumentFileName(uploadedDoc)}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(getDocumentFileSize(uploadedDoc))}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDocument(doc.id)}
                className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium flex-shrink-0"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <label
              htmlFor={doc.id}
              className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <div className="text-center">
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-2 flex text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Upload a file</span>
                      <span className="ml-1">or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
              <input
                id={doc.id}
                type="file"
                className="hidden"
                accept={doc.accept}
                onChange={(e) => handleFileChange(doc.id, e)}
                disabled={isUploading}
              />
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Documents Upload</h2>
      <p className="text-gray-600 mb-6">
        Please upload the following documents to complete your loan application. All required documents must be
        provided.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Documents</h3>
          <div className="space-y-4">{requiredDocuments.map((doc) => renderDocumentCard(doc))}</div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Optional Documents</h3>
          <div className="space-y-4">{optionalDocuments.map((doc) => renderDocumentCard(doc))}</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-blue-800">
              <strong>
                {uploadedDocuments.filter((doc) => requiredDocuments.find((rd) => rd.id === doc.id)).length} of{' '}
                {requiredDocuments.length}
              </strong>{' '}
              required documents uploaded
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={handlePrevious}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !allRequiredUploaded()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Next'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentsUpload;
