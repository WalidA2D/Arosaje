import { Request, Response } from "express";

import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";
import { FavInstance } from "../models/Fav";

class FavController {
  async add(req: Request, res: Response) {
    try{
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { id } = req.body
      if (!id) return res.status(404).json({ success: false, msg: "Aucun ID de Post fournit"})

      if(await FavInstance.findOne({where: { idPost :id, idUser: user.dataValues.idUsers } })) return res.status(413).json({ success: false, msg:"Ce post est déjà parmi les favoris"})

      await FavInstance.create({
        idPost : id,
        idUser : user.dataValues.idUsers
      })
      
      return res.status(200).json({ success: true, msg: "Favori bien ajouté" })
    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de l'addition du favori" });
    }
  }

  async read(req: Request, res: Response) {
    try{
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      
      const favs = await FavInstance.findAll({ where : { idUser : user.dataValues.idUsers }})
      
      const postIds = favs.map(fav => fav.dataValues.idPost);
      const posts = await Promise.all(postIds.map(idPost => PostInstance.findOne({ where: { idPosts:idPost } })));

      const record = posts.filter(post => post !== null);

      return res.status(200).json({ success: true, msg: favs?"Favoris bien trouvés":"Aucun favori répertorié", record})
    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des favoris" });
    }
  }

  async delete(req: Request, res: Response) {
    try{
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      const { id } = req.params
      const favoriPointed = await FavInstance.findOne({ where : { idPost : id, idUser: user.dataValues.idUsers }})
      if ( !favoriPointed ) return res.status(404).json({ success: false, msg:"Favori introuvable"})
      if ( favoriPointed.dataValues.idUser != user.dataValues.idUsers ) return res.status(413).json({ success: false, msg:"Droit requis"})
      await favoriPointed.destroy()
    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la suppression du favori" });
    }
  }
}

export default new FavController();
