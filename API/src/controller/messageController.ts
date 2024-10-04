import { Request, Response } from "express";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserInstance } from "../models/User";
import { MessageInstance } from "../models/Message";
import { verifyToken } from "../helpers/jwtUtils";  // Ajout pour la vérification du JWT

class MessageController {
  async add(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];  // Extraction du token JWT
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const decoded: any = verifyToken(token);  // Décodage du token
      const user = await UserInstance.findOne({ where: { uid: decoded.userId } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { text, publishedAt, idConversation } = req.body;
      const publishedAtDate = publishedAt ? new Date(publishedAt) : new Date();
      const newToken = Date.now().toString(36) + Math.random().toString(36);

      const email = process.env.FIREBASE_AUTH_EMAIL!;
      const password = process.env.FIREBASE_AUTH_PASSWORD!;
      await signInWithEmailAndPassword(auth, email, password);

      let urlFile = "";
      if (req.file) {
        const fileRef = ref(storage, `filesMessages/${newToken}.jpg`);
        const metadata = { contentType: "image/jpg" };
        await uploadBytesResumable(fileRef, req.file.buffer, metadata);
        urlFile = await getDownloadURL(fileRef);
      }

      await MessageInstance.create({
        text,
        publishedAt: publishedAtDate,
        idConversation,
        idUser: user.dataValues.idUsers,
        file: urlFile,
      });

      return res.status(200).json({ success: true, msg: "Message bien ajouté" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de l'ajout du message" });
    }
  }

  async readByUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];  // Extraction du token JWT
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const decoded: any = verifyToken(token);  // Décodage du token
      const user = await UserInstance.findOne({ where: { uid: decoded.userId } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const record = await MessageInstance.findAll({ where: { idUser: user.dataValues.idUsers } });
      if (!record) return res.status(404).json({ success: false, msg: "Aucun message trouvé" });

      return res.status(200).json({ success: true, msg: "Messages trouvés", record });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des messages" });
    }
  }

  async readByConv(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];  // Extraction du token JWT
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const decoded: any = verifyToken(token);  // Décodage du token
      const user = await UserInstance.findOne({ where: { uid: decoded.userId } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { id } = req.params;
      const record = await MessageInstance.findAll({ where: { idConversation: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Aucun message trouvé" });

      return res.status(200).json({ success: true, msg: "Messages trouvés", record });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des messages" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];  // Extraction du token JWT
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const decoded: any = verifyToken(token);  // Décodage du token
      const user = await UserInstance.findOne({ where: { uid: decoded.userId } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { id } = req.params;
      const record = await MessageInstance.findOne({ where: { idMessages: id } });
      if (!record) return res.status(500).json({ success: false, msg: "Message introuvable ou déjà supprimé" });

      if (record.dataValues.idUser !== user.dataValues.idUsers) {
        return res.status(413).json({ success: false, msg: "Droits requis" });
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