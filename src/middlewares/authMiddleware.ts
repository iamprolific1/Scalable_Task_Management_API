import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    user?: { id: string, role: string };
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction)=> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
        req.user = decoded;
        next();
    } catch(error) {
        console.error("Error verifying token: ", error as Error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
}

export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction)=> {
    if (req.user?.role !== 'Admin') {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
}