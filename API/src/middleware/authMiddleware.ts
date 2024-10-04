import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwtUtils';

const authMiddleware = (roles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer token

        if (!token) return res.status(401).json({ success: false, msg: "Accès refusé" });

        try {
            const decoded: any = verifyToken(token);
            req.user = decoded; // Add decoded token to request
            
            // Check for roles if specified
            if (roles.length && !roles.includes(decoded.roles[0])) {
                return res.status(403).json({ success: false, msg: "Accès interdit" });
            }

            next();
        } catch (e) {
            return res.status(403).json({ success: false, msg: "Token invalide" });
        }
    };
};

export default authMiddleware;