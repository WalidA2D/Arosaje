import { Request, Response } from "express";
import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";
import { FavInstance } from "../models/UserFavorites";
import { verifyToken } from "../helpers/jwtUtils"; // Importer la fonction de vérification du token

class FavController {
  async add(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(401).json({ success: false, msg: "Token non fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { id } = req.body;
      if (!id) return res.status(400).json({ success: false, msg: "Aucun ID de Post fourni" });

      if (await FavInstance.findOne({ where: { idPost: id, idUser: user.dataValues.idUser } })) {
        return res.status(409).json({ success: false, msg: "Ce post est déjà parmi les favoris" });
      }

      await FavInstance.create({
        idPost: id,
        idUser: user.dataValues.idUser,
      });

      return res.status(201).json({ success: true, msg: "Favori bien ajouté" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de l'addition du favori" });
    }
  }

  async read(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(401).json({ success: false, msg: "Token non fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const favs = await FavInstance.findAll({ where: { idUser: user.dataValues.idUser } });
      const postIds = favs.map((fav) => fav.dataValues.idPost);

      const posts = await Promise.all(postIds.map((idPost) => PostInstance.findOne({ where: { idPosts: idPost } })));
      const record = posts.filter((post) => post !== null);

      return res.status(200).json({ success: true, msg: favs.length ? "Favoris bien trouvés" : "Aucun favori répertorié", record });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des favoris" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(401).json({ success: false, msg: "Token non fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { id } = req.params;
      const favoriPointed = await FavInstance.findOne({ where: { idPost: id, idUser: user.dataValues.idUser } });
      if (!favoriPointed) return res.status(404).json({ success: false, msg: "Favori introuvable" });

      await favoriPointed.destroy();
      return res.status(200).json({ success: true, msg: "Favori bien supprimé" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la suppression du favori" });
    }
  }
}

export default new FavController();
