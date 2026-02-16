import humps from 'humps';
import { fetchAllApplications, fetchApplicationById } from '../services/applicationApi';

/**
 * Fetches the latest application for the current user
 * and returns personal info + address if available
 */
export const getPersonalInfo = async () => {
  try {
    const response = await fetchAllApplications();
    console.log('*all applications JSON', response);
    if (!response?.applications || response.applications.length === 0) {
      console.warn('No previous applications found.');
      return null;
    }
    // Pick the latest application
    const latestApp = response.applications[0];

    const appDetails = await fetchApplicationById(latestApp.id);

    // Convert snake_case → camelCase
    const camelized = humps.camelizeKeys(appDetails);

    // Return personal info
    const personalInfo = camelized.personalInfo || null;

    return personalInfo || null;
  } catch (err) {
    console.error('Error fetching latest personal info:', err);
    return null;
  }
};

/**
 * Fetches addresses from the latest application for the current user.
 * Returns an array of addresses (empty if none).
 */
export const getLatestAddress = async () => {
  try {
    const response = await fetchAllApplications();

    if (!response?.applications || response.applications.length === 0) {
      console.warn('No previous applications found.');
      return [];
    }

    const latestApplication = response.applications[0];
    const applicationDetails = await fetchApplicationById(latestApplication.id);

    // Convert snake_case → camelCase
    const camelized = humps.camelizeKeys(applicationDetails);
    return camelized.addresses || [];
  } catch (err) {
    console.error('Error fetching latest addresses:', err);
    return [];
  }
};

/**
 * Determines if the address in the form differs from the existing address.
 *
 * @param {Object} existing - The stored address { address_street, city, state, zip }.
 * @param {Object} form - The address from the form { addressStreet, city, state, zip }.
 * @returns {boolean} - True if the address has changed, false if it's the same.
 */
export const getChangedAddress = (existing = {}, form = {}) => {
  const changes = {};

  if ((existing.address_street || '').trim() !== (form.addressStreet || '').trim()) {
    changes.address_street = form.addressStreet;
  }
  if ((existing.city || '').trim() !== (form.city || '').trim()) {
    changes.city = form.city;
  }
  if ((existing.state || '').trim() !== (form.state || '').trim()) {
    changes.state = form.state;
  }
  if ((existing.zip || '').trim() !== (form.zip || '').trim()) {
    changes.zip = form.zip;
  }

  return changes;
};
