import { Request, Response } from "express";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Op } from 'sequelize'

import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";
import { CommentInstance } from "../models/Comment";

class PostController {
  async create(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[0];
      if (!token) {
        return res.status(404).json({ success: false, msg: "Aucun token fourni" });
      }
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) {
        return res.status(404).json({ success: false, msg: "Utilisateur non trouvé" });
      }

      // Assurez-vous que req.body contient toutes les données requises
      const {
        title,
        description,
        publishedAt,
        dateStart,
        dateEnd,
        address,
        cityName,
        state,
        accepted,
        acceptedBy,
        plantOrigin,
        plantRequirements,
        plantType,
      } = req.body;

      // Valider et convertir les dates
      const publishedAtDate = publishedAt ? new Date(publishedAt) : new Date();
      const dateStartDate = dateStart ? new Date(dateStart) : new Date();
      const dateEndDate = dateEnd ? new Date(dateEnd) : new Date();
      
      const record = await PostInstance.create({
        title,
        description,
        publishedAt: publishedAtDate,
        dateStart: dateStartDate,
        dateEnd: dateEndDate,
        address,
        cityName,
        state: state === "true",
        accepted: accepted === "true",
        acceptedBy: acceptedBy ? parseInt(acceptedBy, 10) : null,
        idUser: user.dataValues.idUsers,
        plantOrigin,
        plantRequirements,
        plantType,
        image1: "",
        image2: "",
        image3: "",
      });

      const email = process.env.FIREBASE_AUTH_EMAIL!;
      const password = process.env.FIREBASE_AUTH_PASSWORD!;
      await signInWithEmailAndPassword(auth, email, password);

      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ success: false, message: "Aucun fichier trouvé" });
      }
      const filesURLs: string[] = [];
      const filePromises = (req.files as Express.Multer.File[]).map(
        async (file, index) => {
          const fileName = `${record.dataValues.idPosts}_${index}`;
          const fileRef = ref(storage, `posts/${fileName}.jpg`);
          const metadata = { contentType: 'image/jpg' };
          await uploadBytesResumable(fileRef, file.buffer, metadata);
          const fileURL = await getDownloadURL(fileRef);
          filesURLs[index] = fileURL;
        }
      );

      await Promise.all(filePromises);

      await record.update({
        image1: filesURLs[0] || "",
        image2: filesURLs[1] || "",
        image3: filesURLs[2] || "",
      });

      return res.status(200).json({ success: true, record, msg: "Création post ok" });
    } catch (e) {
      console.error(e);
      return res.status(417).json({ success: false, msg: "Création post échouée" });
    }
  }


  async readPagination(req: Request, res: Response) {
    try {
      const quantite = Number(req.query.quantite) || 10;
      const saut = Number(req.query.saut) || 0;
  
      const filterConditions: any = { state: 0 };
      for (const [key, value] of Object.entries(req.query)) {
        if (key === 'cityName' || key === 'dateStart' || key === 'dateEnd' || key === 'plantType' || key === 'plantOrigin') {
          filterConditions[key] = { [Op.like]: `${value}%` };
        }
      }
      
      const posts = await PostInstance.findAll({
        where: filterConditions,
        limit: quantite,
        offset: saut,
        order: [['publishedAt', 'DESC']]
      });
  
      return res.status(200).json({ success: true, posts });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Lecture échouée" });
    }
  }  

  async readByUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await PostInstance.findAll({ where: { idUser: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Aucun post attribué" });
      return res.status(200).json({ success: true, record });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture" });
    }
  }

  async readById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostInstance.findOne({ where: { idPosts: id } });
      if (!post) return res.status(404).json({ success: false, msg: "Aucun post trouvé" });
      const comments = await CommentInstance.findAll({ where: {idPost : id }, order: [['publishedAt', 'DESC']] })
      return res.status(200).json({ success: true, post, comments });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la recherche d'un post par l'id" });
    }
  }

  async readMissions(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[0];
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur non trouvé" });

      const missions = await PostInstance.findAll({ where: { acceptedBy: user.dataValues.idUsers } });
      if (!missions) return res.status(404).json({ success: false, msg: "Aucune mission trouvée." });

      return res.status(200).json({ success: true, missions });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la recherche de missions" });
    }
  }

  async changeVisibility(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await PostInstance.findOne({ where: { idPosts: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Aucun post trouvé" });
      await record.update({ state: !record.dataValues.state });
      return res.status(200).json({ success: true, msg: "Changement de visibilité effectuée", state: record.dataValues.state });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors du changement de visiblité" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(" ")[0];
      if (!token) return res.status(404).json({ success: false, msg: "Aucun token fourni" });
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      const record = await PostInstance.findOne({ where: { idPosts: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Aucun post trouvé" });

      if ( user?.dataValues.isAdmin || user?.dataValues.idUsers == record.dataValues.idUser ) {
        await record.destroy();
        return res.status(200).json({ success: true, msg: "Post bien supprimé" });
      } else {
        return res.status(413).json({ success: false, msg: "Droits requis" });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture" });
    }
  }
}

export default new PostController();
