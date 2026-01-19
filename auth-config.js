// auth-config.js

// This module provides authentication configuration and utility functions for the application.

const authConfig = {
    jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
    tokenExpiration: '1h', // Token expiration time
};

const generateToken = (user) => {
    const { sign } = require('jsonwebtoken');
    return sign({ id: user.id }, authConfig.jwtSecret, { expiresIn: authConfig.tokenExpiration });
};

const verifyToken = (token) => {
    const { verify } = require('jsonwebtoken');
    return new Promise((resolve, reject) => {
        verify(token, authConfig.jwtSecret, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};

module.exports = { authConfig, generateToken, verifyToken };