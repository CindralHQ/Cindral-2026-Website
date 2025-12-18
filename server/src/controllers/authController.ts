import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { tokens } from '../middleware/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const login = (req: Request, res: Response) => {
    const { password } = req.body || {};
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    const token = nanoid();
    tokens.add(token);
    return res.json({ token });
};

export const logout = (req: Request, res: Response) => {
    const token = (req as any).token;
    if (token && tokens.has(token)) {
        tokens.delete(token);
    }
    return res.json({ success: true });
};
