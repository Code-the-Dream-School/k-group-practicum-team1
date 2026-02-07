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
