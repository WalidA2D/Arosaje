import { Request, Response } from "express";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";

import dotenv from "dotenv";

import { UserInstance } from "../models/User";

dotenv.config();

const defaultPP = "https://firebasestorage.googleapis.com/v0/b/api-arosa-je.appspot.com/o/profilepictures%2Fdefault_pp.png?alt=media&token=2415598b-9c6f-45a1-a9ad-c555cec6c3c6";

class ImageController {
  async uploadPP(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[0];

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const email = process.env.FIREBASE_AUTH_EMAIL!;
      const password = process.env.FIREBASE_AUTH_PASSWORD!;

      await signInWithEmailAndPassword(auth, email, password);

      if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

      const file = req.file;
      const fileRef = ref(storage,`profilepictures/${user.dataValues.idUsers + user.dataValues.firstName[0]}.jpg`);
      const metadata = { contentType: 'image/jpg' };
      await uploadBytesResumable(fileRef, file.buffer, metadata);
      const fileUrl = await getDownloadURL(fileRef);

      await user.update({ photo: fileUrl });

      res.status(201).json({ success: true, msg: "Image ajoutée avec succès", url: fileUrl });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Upload PP échouée" });
    }
  }

  async getPP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await UserInstance.findOne({ where: { idUsers: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      return res.status(200).json({ success: true, url: record.dataValues.photo });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Lecture échouée" });
    }
  }
  
  async resetPP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await UserInstance.findOne({ where: { idUsers: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      await record.update({ photo: defaultPP });

      return res.status(200).json({ success: true, url: record.dataValues.photo });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Update échoué" });
    }
  }
}

export default new ImageController();
