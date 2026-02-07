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

/**
 * Convert US date format (MM/DD/YYYY) to ISO date format (YYYY-MM-DD)
 * for use in date inputs
 *
 * @param {string} usDate - Date in MM/DD/YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateToISO = (usDate) => {
  if (!usDate) return '';
  if (usDate.includes('-')) return usDate;
  const [month, day, year] = usDate.split('/');
  if (!year || !month || !day) return '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
