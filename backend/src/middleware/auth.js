import { verifyToken } from "../utils/jwtToken.js";

export const authToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    const err = new Error('No token provided');
    err.status = 401;
    throw err
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const err = new Error('Invalid or expired token');
    err.status = 403;
    throw err
  }
};