import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '@ecommerce/domain';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export function authMiddleware(authService: AuthenticationService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  };
}

export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole !== requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.code ? 400 : 500;
  const message = err.message || 'Internal server error';

  console.error(err);
  res.status(status).json({ error: message, code: err.code });
}
