import { Request, Response } from "express";
import { CommentInstance } from "../models/Comment";
import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";
import { verifyToken } from "../helpers/jwtUtils"; // Importer la fonction de vérification du token

class CommentController {
  async create(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(401).json({ success: false, msg: "Token non fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur non conforme" });

      const { idPost } = req.body;
      const post = await PostInstance.findOne({ where: { idPosts: idPost } });
      if (!post) return res.status(404).json({ success: false, msg: "Post non trouvé" });

      const record = await CommentInstance.create({ ...req.body, idUser: user.dataValues.idUser });
      return res.status(201).json({ success: true, record, msg: "Commentaire créé avec succès" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la création du commentaire" });
    }
  }

  async readPagination(req: Request, res: Response) {
    try {
      const quantite = parseInt(req.query.quantite as string, 10) || 10;
      const saut = parseInt(req.query.saut as string, 10) || 0;
      const records = await CommentInstance.findAll({ limit: quantite, offset: saut });
      return res.status(200).json({ success: true, records });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des commentaires" });
    }
  }

  async readByPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comments = await CommentInstance.findAll({ where: { idPost: id } });
      if (comments.length === 0) return res.status(404).json({ success: false, msg: "Aucun commentaire trouvé pour ce post" });
      return res.status(200).json({ success: true, comments });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des commentaires" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(401).json({ success: false, msg: "Token non fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { id } = req.params;
      const record = await CommentInstance.findOne({ where: { idComments: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Commentaire introuvable" });

      if (user.dataValues.isAdmin || user.dataValues.idUser === record.dataValues.idUser) {
        await record.destroy();
        return res.status(200).json({ success: true, msg: "Commentaire supprimé avec succès" });
      } else {
        return res.status(403).json({ success: false, msg: "Droits requis" });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la suppression du commentaire" });
    }
  }
}

export default new CommentController();
