import { Request, Response } from "express";

import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";

class PostController {
	async create(req: Request, res: Response) {
		try {
			const record = await PostInstance.create({ ...req.body });
			return res.status(200).json({ record , msg: "Création post ok" });
		} catch (e) {
			return res.status(417).json({ msg: "Création post échouée", status: 417, route: "/post/create", e });
		}
	}

	async readPagination(req:Request, res:Response){
		try {
			const limit = (req.query.limit as number | undefined) || 10;
			const offset = req.query.offset as number | undefined;
			const records = await PostInstance.findAll({ where: {}, limit, offset });
			return res.status(200).json({ records });
		} catch (e) {
			return res.status(500).json({ msg: "Lecture échouée", status: 500, route: "/post/read" });
		}
	}

	async readByUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await PostInstance.findOne({ where: { idUser : id } });
			if(!record) return res.status(404).json({msg:"Aucun post attribué"})
			return res.status(200).json({record});
		} catch (e) {
			console.error(e)
			return res.status(500).json({ msg: "Erreur lorsde la lecture", status: 500, e, route: "/post/read/:id" });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const token = req.headers.authorization?.split(' ')[0];
			const user = await UserInstance.findOne({ where: { uid : token }})
			const record = await PostInstance.findOne({ where: { idUser : id } });

			if(!user) return res.status(404).json({ status: 404, msg: 'Utilisateur introuvable'})

			if (!record || !token) {
				return res.status(404).json({ status : 404, msg: 'Aucun '+ token?'post trouvé':'token fourni' });
			}

			if(user?.dataValues.isAdmin || user?.dataValues.idUsers == record.dataValues.idUser){
				await record.destroy();
				return res.status(200).json({ msg: "Post bien supprimé" });
			} else {
				return res.status(500).json({ msg : "Erreur interne serveur lors de la suppression"})
			}
		} catch (e) {
			console.error(e)
			return res.status(500).json({ msg: "Erreur lorsde la lecture", status: 500, e, route: "/post/read/:id" });
		}
	}
}

export default new PostController();