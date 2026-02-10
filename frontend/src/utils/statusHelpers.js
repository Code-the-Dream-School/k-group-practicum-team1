/**
 * Get Tailwind CSS classes for status badge styling
 * @param {string} status - The application status
 * @returns {string} Tailwind CSS classes for the badge
 */
export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    draft: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-400 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
  };
  return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Format status string for display (convert snake_case to Title Case)
 * @param {string} status - The status string to format
 * @returns {string} Formatted status string
 */
export const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};
