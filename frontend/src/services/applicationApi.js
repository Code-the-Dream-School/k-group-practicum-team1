import { apiFetch } from './api';

export const fetchApplicationById = async (applicationId) => {
  const response = await apiFetch(`/api/v1/applications/${applicationId}`, {
    method: 'GET',
  });
  return response.data;
};

export const createApplication = async (applicationData) => {
  const response = await apiFetch('/api/v1/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ application: applicationData }),
  });
  return response.data;
};

export const updateApplication = async (applicationId, applicationData) => {
  const response = await apiFetch(`/api/v1/applications/${applicationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ application: applicationData }),
  });
  return response.data;
};

export const fetchAllApplications = async () => {
  const response = await apiFetch(`/api/v1/applications`, {
    method: 'GET',
  });
  return response.data;
};

export async function uploadDocument(applicationId, file, documentName, description) {
  const formData = new FormData();
  formData.append('document[file_url]', file);
  formData.append('document[document_name]', documentName);
  formData.append('document[description]', description);

  try {
    const { data } = await apiFetch(`/api/v1/applications/${applicationId}/documents`, {
      method: 'POST',
      body: formData,
    });

    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to upload document.';
    throw errorMessage;
  }
}
