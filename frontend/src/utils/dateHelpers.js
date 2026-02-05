/**
 * Convert ISO date format (YYYY-MM-DD) to US date format (MM/DD/YYYY)
 * without timezone issues
 *
 * @param {string} isoDate - Date in YYYY-MM-DD format
 * @returns {string} Date in MM/DD/YYYY format
 */
export const formatDateToUS = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
};
