import { Request, Response } from "express";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserInstance } from "../models/User";
import { MessageInstance } from "../models/Message";
import { verifyToken } from "../helpers/jwtUtils"; // Vérification du JWT

class MessageController {
  async add(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { text, publishedAt, idConversation } = req.body;
      const publishedAtDate = publishedAt ? new Date(publishedAt) : new Date();

      await MessageInstance.create({
        text,
        publishedAt: publishedAtDate,
        idConversation,
        idUser: user.dataValues.idUser
      });

      return res.status(200).json({ success: true, msg: "Message bien ajouté" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de l'ajout du message" });
    }
  }

  async readByUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const record = await MessageInstance.findAll({ where: { idUser: user.dataValues.idUser } });
      if (!record) return res.status(404).json({ success: false, msg: "Aucun message trouvé" });

      return res.status(200).json({ success: true, msg: "Messages trouvés", record });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des messages" });
    }
  }

  async readByConv(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

        const { id } = req.params;
        const record = await MessageInstance.findAll({ where: { idConversation: id } });
        if (!record || record.length === 0) {
            console.warn(`Aucun message trouvé pour la conversation ID : ${id}`);
            return res.status(404).json({ success: false, msg: "Aucun message trouvé" });
        }

        return res.status(200).json({ success: true, msg: "Messages trouvés", record });
    } catch (e) {
        console.error('Erreur côté serveur :', e);
        return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des messages" });
    }
}

  async delete(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { id } = req.params;
      const record = await MessageInstance.findOne({ where: { idMessages: id } });
      if (!record) return res.status(500).json({ success: false, msg: "Message introuvable ou déjà supprimé" });

      if (record.dataValues.idUser !== user.dataValues.idUser) {
        return res.status(403).json({ success: false, msg: "Droits requis" });
      }

      await record.destroy();
      return res.status(200).json({ success: true, msg: "Message bien supprimé" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la suppression du message" });
    }
  }
}

export default new MessageController();
