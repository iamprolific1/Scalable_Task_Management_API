import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    user?: { id: string; role: string };
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction): void=> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('Not authorized, no token')
        res.status(401).json({ message: 'Not authorized, no token' });
        return
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
        req.user = decoded;
        next();
    } catch(error) {
        console.error("Error verifying token: ", error as Error);
        res.status(401).json({ message: "Not authorized, token failed" });
        return;
    }
}

export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction)=> {
    if (req.user?.role !== 'Admin') {
        res.status(403).json({ message: "Access denied: Admins only" });
        return;
    }
    next();
}