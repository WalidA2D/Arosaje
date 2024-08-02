import { Request, Response, NextFunction } from "express";
// import jwt from 'jsonwebtoken';
import { UserInstance } from "../models/User";

function authMiddleware(options?: { roles?: string[] }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[0];
    if (!token) return res.status(401).json({ success: false, error: "Aucun token fourni" });
    try {
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (user == null) {
        return res.status(401).json({ success: false, error: "Token invalide" });
      }
      if (!options?.roles) {
        return res.status(500).json({ success: false, error: "Erreur lors de la route MASSSSIIIIL" });
      }

      if ((user.dataValues.isAdmin && options?.roles[0] == "admin") ||
          (user.dataValues.isBotanist && options?.roles[0] == "botaniste") ||
          (user.dataValues.uid && options?.roles[0] == "utilisateur")) 
      {
          next();
      } else {
        return res.status(403).json({ success: false, error: "Utilisateur non autorisé" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: "Erreur serveur interne" });
    }
  };
}

export default authMiddleware;
