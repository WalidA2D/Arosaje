import { Request, Response } from "express";

import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";
import { FavInstance } from "../models/Fav";

class CommentController {
  async add(req: Request, res: Response) {
    try{
      const token = req.headers.authorization?.split(" ")[0];

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      

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


    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la suppression du favori" });
    }
  }
}

export default new CommentController();
