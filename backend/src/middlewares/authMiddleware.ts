import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '../types';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    name: string;
    email: string;
    roles: UserRole[];
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get token from cookie first, then from Authorization header
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      return;
    }

    // Set user data from decoded token (no database call needed)
    req.user = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      roles: decoded.roles as UserRole[],
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

