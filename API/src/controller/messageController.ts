import { Request, Response } from "express";

import { UserInstance } from "../models/User";
import { MessageInstance } from "../models/Message";

class MessageController {
  async add(req: Request, res: Response) {
    try{
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { text, publishedAt, idConversation } = req.body;

      await MessageInstance.create({
        text,
        publishedAt,
        idConversation,
        idUser:user.dataValues.idUsers
      })
      
      return res.status(200).json({ success: true, msg: "Message bien ajouté" })
    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de l'addition du message" });
    }
  }

  async readByUser(req: Request, res: Response) {
    try{
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      
      const record = await MessageInstance.findAll({ where : { idUser : user.dataValues.idUsers }})
      return res.status(200).json({ success: true, msg: record?"Messages bien trouvés":"Aucun message répertorié", record})
    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des messages" });
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

export default new MessageController();