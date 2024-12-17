import { Request, Response } from "express";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import dotenv from "dotenv";
import { UserInstance } from "../models/User";
import { verifyToken } from "../helpers/jwtUtils"; // Importer la fonction de vérification du token

dotenv.config();

const defaultPP = "https://firebasestorage.googleapis.com/v0/b/api-arosa-je.appspot.com/o/constants%2Fdefault_pp.jpeg?alt=media&token=c777b8c6-7342-4165-9c0f-7ad9ed91ca3b";

class ImageController {
  async uploadPP(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const email = process.env.FIREBASE_AUTH_EMAIL!;
      const password = process.env.FIREBASE_AUTH_PASSWORD!;
      await signInWithEmailAndPassword(auth, email, password);

      if (!req.file) return res.status(400).json({ success: false, message: "Aucun fichier téléchargé" });

      const file = req.file;
      const fileRef = ref(storage, `profilepictures/${user.dataValues.idUser + user.dataValues.firstName[0]}.jpg`);
      const metadata = { contentType: 'image/jpg' };
      await uploadBytesResumable(fileRef, file.buffer, metadata);
      const fileUrl = await getDownloadURL(fileRef);

      await user.update({ photo: fileUrl });

      res.status(200).json({ success: true, msg: "Image ajoutée avec succès", url: fileUrl });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Échec de l'upload du PP" });
    }
  }

  async getPP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await UserInstance.findOne({ where: { idUser: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      return res.status(200).json({ success: true, url: record.dataValues.photo });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Échec de la lecture" });
    }
  }

  async resetPP(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      await user.update({ photo: defaultPP });

      return res.status(200).json({ success: true, url: user.dataValues.photo });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Échec de la mise à jour" });
    }
  }
}

export default new ImageController();
