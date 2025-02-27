import { Request, Response } from "express";
import { Op, Sequelize} from "sequelize";
import { UserInstance } from "../models/User";
import { ConversationInstance } from "../models/Conversation";
import { MessageInstance } from "../models/Message";
import { UsersConversationsInstance } from "../models/UserConversations";
import { verifyToken } from "../helpers/jwtUtils"; 

class ConversationsController {
  async add(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(401).json({ success: false, msg: "Token non fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { idUser1, idUser2 } = req.body;

      if (user.dataValues.idUser.toString() !== idUser1.toString() &&
          user.dataValues.idUser.toString() !== idUser2.toString()) {
        return res.status(403).json({ success: false, msg: "Droits requis" });
      }

      const convExist = await ConversationInstance.findOne({
        include: [
          {
            model: UsersConversationsInstance,
            as: 'UsersConversations',
            where: {
              idUser: {
                [Op.in]: [idUser1, idUser2],
              },
            },
            required: true,
          },
        ],
        where: {
          idConversation: {
            [Op.in]: Sequelize.literal(`
              (SELECT "uc1"."idConversation"
               FROM "UsersConversations" AS "uc1"
               JOIN "UsersConversations" AS "uc2"
               ON "uc1"."idConversation" = "uc2"."idConversation"
               WHERE "uc1"."idUser" = ${idUser1} AND "uc2"."idUser" = ${idUser2}
              )
            `),
          },
        },
        attributes: ['idConversation'], 
      }); 
      

      if (convExist) {
        return res.status(200).json({ success: true, msg: "Conversation déjà existante", idConv: convExist.dataValues.idConversation });
      }

      const newConversation = await ConversationInstance.create({
        dateStart: new Date(),
        seen: false,
      });

      await UsersConversationsInstance.bulkCreate([
        { idUser: idUser1, idConversation: newConversation.dataValues.idConversation },
        { idUser: idUser2, idConversation: newConversation.dataValues.idConversation },
      ]);
      return res.status(201).json({success: true, msg: "Conversation bien ajoutée", idConv : newConversation.dataValues.idConversation});

    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de l'addition de la conversation" });
    }
  }

  async read(req: Request, res: Response) {
    try {
      const records = await ConversationInstance.findAll();
      return res.status(200).json({ success: true, msg: records.length ? "Conversations bien trouvées" : "Aucune conversation répertoriée", conversations : records });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture des conversations" });
    }
  }

  async readByUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      if (!token) { return res.status(401).json({ success: false, msg: 'Token non fourni' });}
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) {return res.status(404).json({ success: false, msg: 'Utilisateur introuvable' });}
      const userId = user.dataValues.idUser;
      if (!userId) {
        return res.status(400).json({ success: false, msg: "ID utilisateur manquant" });
      }
  
      const records = await UsersConversationsInstance.findAll({
        where: { idUser: userId },
        attributes: ['idUser', 'idConversation'], // Récupère les infos nécessaires
        include: [
          {
            model: ConversationInstance,
            as: 'Conversation',
            attributes: ['idConversation', 'dateStart', 'dateEnd', 'seen'], // Infos de la conversation
            include: [
              {
                model: UsersConversationsInstance,
                as: 'UsersConversations',
                include: [
                  {
                    model: UserInstance,
                    as: 'User',
                    attributes: ['idUser', 'firstName', 'lastName', 'photo'], // Infos de l'autre utilisateur
                    where: {
                      idUser: { [Op.ne]: userId }, // Exclut l'utilisateur connecté
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
  
      if (!records.length) {
        return res.status(404).json({ success: false, msg: 'Aucune conversation trouvée' });
      }
  
      return res.status(200).json({
        success: true,
        msg: 'Conversations bien trouvées',
        conversations: records,
      });
    } catch (e) {
      console.error('Erreur côté serveur :', e);
      return res.status(500).json({
        success: false,
        msg: 'Erreur lors de la lecture des conversations',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const token = req.headers.authorization
      if (!token) return res.status(401).json({ success: false, msg: "Token non fourni" });

      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });

      const { id } = req.params;
      const record = await ConversationInstance.findOne({ where: { idConversations: id } });
      if (!record) return res.status(404).json({ success: false, msg: "Conversation cible introuvable ou déjà supprimée" });

      if (user.dataValues.idUser !== record.dataValues.idUser1 &&
          user.dataValues.idUser !== record.dataValues.idUser2) {
        return res.status(403).json({ success: false, msg: "Droits requis" });
      }

      await record.destroy();
      const messagesConv = await MessageInstance.findAll({ where: { idConversation: record.dataValues.idConversations } });
      for (const message of messagesConv) {
        await message.destroy();
      }

      return res.status(200).json({ success: true, msg: "Conversation bien supprimée" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la suppression de la conversation" });
    }
  }
}

export default new ConversationsController();