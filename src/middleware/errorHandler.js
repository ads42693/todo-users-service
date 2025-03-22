const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ errors: messages });
  }

  // Handle mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value entered' });
  }

  // Handle mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Resource not found with id of ${err.value}` });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Send generic error response for any other errors
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};