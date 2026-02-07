// src/config/database.js

/**
 * Database connection module
 * In production, this would connect to a real database.
 * During testing, this module is mocked by tests/__mocks__/database.js
 */
const db = {
  async query(sql, params = []) {
    throw new Error('Database not configured. Set up a real database connection or use the mock for testing.');
  }
};

module.exports = db;
