/**
 * Sanitizes input prompt strings by trimming and removing control characters/null bytes.
 * @param {string} text - Input to sanitize
 * @returns {string} Cleaned input string
 */
export const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
};

/**
 * Standardize successful AI response structure.
 * @param {string|null} message - Informative success message
 * @param {object} data - Payload data
 * @returns {object} Standard success response object
 */
export const formatAiSuccess = (message, data) => {
  const response = {
    success: true,
  };
  if (message !== null && message !== undefined) {
    response.message = message;
  }
  if (data !== undefined) {
    response.data = data;
  }
  return response;
};

/**
 * Standardize failure AI response structure.
 * @param {string} message - Error description
 * @returns {object} Standard error response object
 */
export const formatAiError = (message) => {
  return {
    success: false,
    message,
  };
};
