// tests/unit/errorHandler.test.js
const {
  AppError,
  handleDatabaseError,
  handleValidationError,
  handleNotFoundError,
  handleAuthError,
  handleForbiddenError
} = require('../../src/utils/errorHandler');

describe('Error Handler', () => {
  
  describe('AppError', () => {
    
    test('should create error with correct properties', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
    });
    
    test('should be instance of Error', () => {
      const error = new AppError('Test', 500, 'TEST');
      expect(error).toBeInstanceOf(Error);
    });
    
    test('should have stack trace', () => {
      const error = new AppError('Test', 500, 'TEST');
      expect(error.stack).toBeDefined();
    });
  });
  
  describe('handleDatabaseError', () => {
    
    // Connection errors
    test('should handle connection refused', () => {
      const dbError = { code: 'ECONNREFUSED' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Database connection failed');
      expect(error.statusCode).toBe(503);
      expect(error.code).toBe('DB_CONNECTION_ERROR');
    });
    
    // Duplicate entry
    test('should handle duplicate entry', () => {
      const dbError = { code: 'ER_DUP_ENTRY' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Duplicate entry');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('DUPLICATE_ENTRY');
    });
    
    // Foreign key constraint
    test('should handle foreign key error', () => {
      const dbError = { code: 'ER_NO_REFERENCED_ROW' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Referenced record not found');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('FOREIGN_KEY_ERROR');
    });
    
    // Timeout
    test('should handle timeout error', () => {
      const dbError = { code: 'ETIMEDOUT' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Database operation timeout');
      expect(error.statusCode).toBe(504);
      expect(error.code).toBe('DB_TIMEOUT');
    });
    
    // Unknown error
    test('should handle unknown database error', () => {
      const dbError = { code: 'UNKNOWN_ERROR' };
      const error = handleDatabaseError(dbError);
      
      expect(error.message).toBe('Database error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DB_ERROR');
    });
    
    test('should handle error without code', () => {
      const dbError = { message: 'Some error' };
      const error = handleDatabaseError(dbError);
      
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DB_ERROR');
    });
  });
  
  describe('handleValidationError', () => {
    
    test('should handle single validation error', () => {
      const errors = [{ message: 'Email is required' }];
      const error = handleValidationError(errors);
      
      expect(error.message).toBe('Email is required');
      expect(error.statusCode).toBe(422);
      expect(error.code).toBe('VALIDATION_ERROR');
    });
    
    test('should handle multiple validation errors', () => {
      const errors = [
        { message: 'Email is required' },
        { message: 'Password is too short' }
      ];
      const error = handleValidationError(errors);
      
      expect(error.message).toBe('Email is required, Password is too short');
      expect(error.statusCode).toBe(422);
    });
    
    test('should handle empty errors array', () => {
      const errors = [];
      const error = handleValidationError(errors);
      
      expect(error.message).toBe('');
      expect(error.statusCode).toBe(422);
    });
  });
  
  describe('handleNotFoundError', () => {
    
    test('should create not found error', () => {
      const error = handleNotFoundError('User');
      
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });
    
    test('should work with different resource names', () => {
      expect(handleNotFoundError('Todo').message).toBe('Todo not found');
      expect(handleNotFoundError('Product').message).toBe('Product not found');
    });
  });
  
  describe('handleAuthError', () => {
    
    test('should create authentication error', () => {
      const error = handleAuthError();
      
      expect(error.message).toBe('Authentication required');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });
  });
  
  describe('handleForbiddenError', () => {
    
    test('should create authorization error', () => {
      const error = handleForbiddenError();
      
      expect(error.message).toBe('Access forbidden');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });
  });
});