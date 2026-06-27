import jwt from 'jsonwebtoken';

/**
 * Generate a short-lived access token (15 minutes)
 */
export const generateAccessToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return jwt.sign({ id: userId.toString() }, secret, {
    expiresIn: '2h',
  });
};

/**
 * Generate a long-lived refresh token (30 days)
 */
export const generateRefreshToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return jwt.sign({ id: userId.toString() }, secret, {
    expiresIn: '30d',
  });
};
