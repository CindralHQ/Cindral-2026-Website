import { Request, Response, NextFunction } from 'express';

// Simple in-memory token store for now.
// In a real app, this should be in Redis or a DB.
export const tokens = new Set<string>();

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const [, token] = auth.split(' ');
    if (!token || !tokens.has(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    (req as any).token = token;
    return next();
};
