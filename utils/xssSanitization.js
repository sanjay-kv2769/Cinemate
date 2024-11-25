const xssFilters = require('xss-filters');

// Function to sanitize objects recursively
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = xssFilters.inHTMLData(obj[key]);
    } else if (typeof obj[key] === 'object') {
      obj[key] = sanitizeObject(obj[key]);
    }
  }

  return obj;
};

// Middleware function for XSS cleaning
const xssCleanMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = xssCleanMiddleware;
