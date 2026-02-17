const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * @param {string} userId - MongoDB user ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' } 
  );
};

module.exports = generateToken;



/*
What this does:

Creates a JWT token with user ID
Uses secret key from .env
Token expires in 30 days
Used when user registers or logs in
*/