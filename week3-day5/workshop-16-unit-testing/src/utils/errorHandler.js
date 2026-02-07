// src/utils/errorHandler.js

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle database errors
 */
function handleDatabaseError(error) {
  // Connection error
  if (error.code === 'ECONNREFUSED') {
    return new AppError(
      'Database connection failed',
      503,
      'DB_CONNECTION_ERROR'
    );
  }
  
  // Duplicate key error
  if (error.code === 'ER_DUP_ENTRY') {
    return new AppError(
      'Duplicate entry',
      409,
      'DUPLICATE_ENTRY'
    );
  }
  
  // Foreign key constraint error
  if (error.code === 'ER_NO_REFERENCED_ROW') {
    return new AppError(
      'Referenced record not found',
      400,
      'FOREIGN_KEY_ERROR'
    );
  }
  
  // Timeout error
  if (error.code === 'ETIMEDOUT') {
    return new AppError(
      'Database operation timeout',
      504,
      'DB_TIMEOUT'
    );
  }
  
  // Unknown database error
  return new AppError(
    'Database error',
    500,
    'DB_ERROR'
  );
}

/**
 * Handle validation errors
 */
function handleValidationError(errors) {
  const message = errors.map(e => e.message).join(', ');
  return new AppError(message, 422, 'VALIDATION_ERROR');
}

/**
 * Handle not found error
 */
function handleNotFoundError(resource) {
  return new AppError(
    `${resource} not found`,
    404,
    'NOT_FOUND'
  );
}

/**
 * Handle authentication error
 */
function handleAuthError() {
  return new AppError(
    'Authentication required',
    401,
    'UNAUTHORIZED'
  );
}

/**
 * Handle authorization error
 */
function handleForbiddenError() {
  return new AppError(
    'Access forbidden',
    403,
    'FORBIDDEN'
  );
}

module.exports = {
  AppError,
  handleDatabaseError,
  handleValidationError,
  handleNotFoundError,
  handleAuthError,
  handleForbiddenError
};