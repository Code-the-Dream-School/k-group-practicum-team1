/**
 * Format a number as US currency
 * @param {number} value - The numeric value to format
 * @param {object} options - Optional formatting options
 * @param {number} options.minimumFractionDigits - Minimum decimal places (default: 2)
 * @param {number} options.maximumFractionDigits - Maximum decimal places (default: 2)
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (value, options = {}) => {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;

  // When maximumFractionDigits is 0, minimumFractionDigits should also be 0
  const minDigits = maximumFractionDigits === 0 ? 0 : minimumFractionDigits;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: minDigits,
    maximumFractionDigits,
  }).format(value);
};
