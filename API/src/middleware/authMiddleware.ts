import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserInstance } from '../models/user';

function authMiddleware(options?: { roles?: string[] }) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Aucun token fourni' });
        }

        try {
            console.log('AUTHMIDDLEWARE FONCTION A FAIRE, TOKEN FOURNI : ',token)
            next();
        } catch (error) {
            res.status(401).json({ error: 'Non autorisé' });
        }
    };
}

export default authMiddleware;