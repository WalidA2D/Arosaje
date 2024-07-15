import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserInstance } from '../models/user';

function authMiddleware(options?: { roles?: string[] }) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[0];
        console.log(token)
        if (!token) {
            return res.status(401).json({ error: 'Aucun token fourni' });
        }
        try {
            
            const user = await UserInstance.findOne({where:{uid:token}})

            if (user == null) {
                return res.status(401).json({ error: 'Token invalide' });
            }

            if (!options?.roles) {
                return res.status(500).json({ error: 'Erreur lors de la route MASSSSIIIIL' });
            }

            if((user.dataValues.isAdmin && options?.roles[0] == "admin") || (user.dataValues.isBotanist && options?.roles[0] == "botaniste")){
                next();
            } else {
                return res.status(403).json({ error: 'Utilisateur non autorisé' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Erreur serveur interne' });
        }
    };
}

export default authMiddleware;