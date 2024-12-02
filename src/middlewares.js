/**
 * Middleware to handle 404 Not Found errors.
 *
 * This middleware sets the response status to 404 and creates an error object
 * with a message indicating that the requested URL was not found. It then passes
 * the error to the next middleware in the stack for further handling.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.originalUrl - The original URL requested by the client.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
export function notFoundHandler(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

/**
 * Error handling middleware for Express.js applications.
 *
 * This middleware captures any errors that occur during the request-response cycle.
 * It sets the response status code to the error status code if it is not 200, otherwise
 * it defaults to 500 (Internal Server Error). It then sends a JSON response containing
 * the error message and stack trace.
 *
 * @param {Error} err - The error object.
 * @param {string} err.message - The error message.
 * @param {string} err.stack - The stack trace of the error.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    // Only include stack trace in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
