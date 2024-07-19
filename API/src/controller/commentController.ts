import { Request, Response } from "express";
import { CommentInstance } from "../models/Comment";
import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";

class CommentController {
    async create(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[0];
            const user = await UserInstance.findOne({ where: { uid: token } });
            if (!user) {
                return res.status(404).json({ msg: "Utilisateur non conforme" });
            }
            const { idPost } = req.body;
            
            const post = await PostInstance.findOne({ where: { idPosts: idPost } });
            if (!post) return res.status(404).json({ msg: "Post non trouvé" });

            const record = await CommentInstance.create({ ...req.body, idUser:user.dataValues.idUsers });
            return res.status(200).json({ record, msg: "Création commentaire ok" });
        } catch (e) {
            return res.status(417).json({ msg: "Création commentaire échouée", status: 417, route: "/comment/create", e });
        }
    }

    async readPagination(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const offset = parseInt(req.query.offset as string, 10) || 0;
            const records = await CommentInstance.findAll({ where: {}, limit, offset });
            return res.status(200).json({ records });
        } catch (e) {
            return res.status(500).json({ msg: "Lecture échouée", status: 500, route: "/comment/read" });
        }
    }

    async readByPost(req: Request, res: Response) {
        try {
            const { idPost } = req.params;
            const records = await CommentInstance.findAll({ where: { idPost } });
            if (records.length === 0) return res.status(404).json({ msg: "Aucun commentaire trouvé pour ce post" });
            return res.status(200).json({ records });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ msg: "Erreur lors de la lecture", status: 500, e, route: "/comment/readByPost/:idPost" });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const token = req.headers.authorization?.split(' ')[1];
            const user = await UserInstance.findOne({ where: { uid: token } });
            const record = await CommentInstance.findOne({ where: { idComments: id } });

            if (!user) return res.status(404).json({ status: 404, msg: 'Utilisateur introuvable' });
            if (!record) return res.status(404).json({ status: 404, msg: 'Commentaire non trouvé' });

            // Vérifier si le post associé au commentaire existe
            const post = await PostInstance.findOne({ where: { idPosts: record.dataValues.idPost } });
            if (!post) return res.status(404).json({ msg: "Post associé au commentaire non trouvé" });

            if (user.dataValues.isAdmin || user.dataValues.idUsers === record.dataValues.idUser) {
                await record.destroy();
                return res.status(200).json({ msg: "Commentaire bien supprimé" });
            } else {
                return res.status(403).json({ msg: "Permission refusée pour supprimer ce commentaire" });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({ msg: "Erreur lors de la suppression", status: 500, e, route: "/comment/delete/:id" });
        }
    }
}

export default new CommentController();
