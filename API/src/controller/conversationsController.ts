import { Request, Response } from "express";
import { Op } from "sequelize"

import { UserInstance } from "../models/User";
import { ConvInstance } from "../models/Conversation";
import { MessageInstance } from "../models/Message";

class ConversationsController {
  async add(req: Request, res: Response) {
    try{
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { dateStart, dateEnd, idUser1, idUser2 } = req.body;

      if(user.dataValues.idUsers.toString() != idUser1.toString()
        && user.dataValues.idUsers.toString() != idUser2.toString()
      ){
        return res.status(413).json({ success: false, msg:"Droits requis"})
      }

      const convExist = await ConvInstance.findOne({
        where: {
          [Op.or]: [
            { idUser1: idUser1, idUser2: idUser2 },
            { idUser1: idUser2, idUser2: idUser1 }
          ]
        }
      })
      if (convExist) return res.status(200).json({ success: true, msg:"Conversation déjà existante", idConv:convExist.dataValues.idConversations});

      await ConvInstance.create({
        dateStart,
        dateEnd,
        seen : 0,
        idUser1,
        idUser2
      })
      
      return res.status(200).json({ success: true, msg: "Conversation bien ajoutée" })
    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de l'addition de la conversation" });
    }
  }
  
  async read(req: Request, res: Response) {
    try{
      const record = await ConvInstance.findAll()
      return res.status(200).json({ success: true, msg: record?"Conversations bien trouvées":"Aucune conversation répertoriée", record})
    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des conversations" });
    }
  }

  async readByUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
  
      const userId = user.dataValues.idUsers;
  
      const records = await ConvInstance.findAll({
        where: {
          [Op.or]: [
            { idUser1: userId },
            { idUser2: userId }
          ]
        }
      });
      
      if (records.length === 0) {
        return res.status(404).json({ success: false, msg: "Aucune conversation trouvée concernant cet utilisateur" });
      }
      
      const usersId = records.map(record => 
        record.dataValues.idUser1 === userId ? record.dataValues.idUser2 : record.dataValues.idUser1
      );
      
      const users = await Promise.all(usersId.map(idU => UserInstance.findOne({ where: { idUsers: idU } })));
      
      const record = users.filter(u => u !== null);
      
      const conversations = record.map((u, index) => ({
        //info users
        idUser: u.dataValues.idUsers,
        firstName: u.dataValues.firstName,
        lastName: u.dataValues.lastName,
        photo: u.dataValues.photo,
        role: u.dataValues.isAdmin ? "Administrateur" : u.dataValues.isBotanist ? "Botaniste" : "",
        note: u.dataValues.note,

        //infos convs
        idConversation: records[index].dataValues.idConversations,
        dateStart: records[index].dataValues.dateStart,
        seen: records[index].dataValues.seen
      }));
      
      return res.status(200).json({ success: true, msg: "Conversations bien trouvées", conversations });
      
  
      return res.status(200).json({ success: true, msg: "Conversations bien trouvées", conversations });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des conversations" });
    }
  }
  

  async delete(req: Request, res: Response) {
    try{
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      const { id } = req.params
      const record = await ConvInstance.findOne({ where : { idConversations : id }})
      if(!record) return res.status(500).json({ success : false, msg:"Conversation cible introuvable ou déjà supprimé"})
      
      if(user.dataValues.idUsers !== record.dataValues.idUser1
        && user.dataValues.idUsers !== record.dataValues.idUser2
      ){
        return res.status(413).json({ success: false, msg:"Droits requis"})
      }
      await record.destroy();
      
      const messagesConv = await MessageInstance.findAll({ where : { idConversation : record.dataValues.idConversations }})
      for (const message of messagesConv) {
        await message.destroy();
      }
      return res.status(200).json({ success : true, msg:"Conversation bien supprimée"})
    } catch (e){
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la suppression de la conversation" });
    }
  }
}

export default new ConversationsController();