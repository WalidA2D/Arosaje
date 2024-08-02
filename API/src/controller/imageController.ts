import { Request, Response } from "express";
import path from "path";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";

import dotenv from "dotenv";

import { UserInstance } from "../models/User";

dotenv.config();

class ImageController {
  async uploadPP(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[0];

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ msg: "Utilisateur introuvable", status: 404 });

      const email = process.env.FIREBASE_AUTH_EMAIL!;
      const password = process.env.FIREBASE_AUTH_PASSWORD!;

      await signInWithEmailAndPassword(auth, email, password);

      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const file = req.file;
      const fileRef = ref(storage,`profilepictures/${user.dataValues.idUsers + user.dataValues.firstName[0]}.jpeg`);

      await uploadBytesResumable(fileRef, file.buffer);
      const fileUrl = await getDownloadURL(fileRef);

      await user.update({ photo: fileUrl });

      res.status(201).json({ msg: "Image ajoutée avec succès", url: fileUrl });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ msg: "Lecture échouée", status: 500 });
    }
  }

  async getPP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await UserInstance.findOne({ where: { idUsers: id } });
      if (!record) return res.status(404).json({ msg: "Utilisateur introuvable" });
      return res.status(200).json({ url: record.dataValues.photo });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ msg: "Lecture échouée", status: 500 });
    }
  }
}

export default new ImageController();
