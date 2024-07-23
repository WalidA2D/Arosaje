import { Request, Response } from "express";

import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";

class PostController {
	async create(req: Request, res: Response) {
		try {
			const token = req.headers.authorization?.split(' ')[0];
			if(!token) return res.status(404).json({ status : 404, msg: 'Aucun token fourni' })

			const user = await UserInstance.findOne({ where: { uid : token}})
			const record = await PostInstance.create({ ...req.body, idUser : user?.dataValues.idUsers });
			return res.status(200).json({ record , msg: "Création post ok" });
		} catch (e) {
            console.error(e)
			return res.status(417).json({ msg: "Création post échouée", status: 417, route: "/post/create" });
		}
	}

	async readPagination(req:Request, res:Response){
		try {
			const amont = (req.query.amont as number | undefined) || 10;
			const saut = req.query.saut as number | undefined;
			const records = await PostInstance.findAll({ where: {}, limit: amont, offset: saut });
			return res.status(200).json({ records });
		} catch (e) {
            console.error(e)
			return res.status(500).json({ msg: "Lecture échouée", status: 500, route: "/post/read" });
		}
	}

	async readByUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await PostInstance.findAll({ where: { idUser : id } });
			if(!record) return res.status(404).json({msg:"Aucun post attribué"})
			return res.status(200).json({record});
		} catch (e) {
            console.error(e)
			return res.status(500).json({ msg: "Erreur lorsde la lecture", status: 500, route: "/post/read/:id" });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const token = req.headers.authorization?.split(' ')[0];
			if(!token) return res.status(200).json({ status : 200, msg: 'Aucun token fourni' })
			const user = await UserInstance.findOne({ where: { uid : token }})
			if(!user) return res.status(404).json({ status: 404, msg: 'Utilisateur introuvable'})
			const record = await PostInstance.findOne({ where: { idPosts : id } });
			if (!record) return res.status(404).json({ status : 404, msg: 'Aucun post trouvé' });

			if(user?.dataValues.isAdmin || user?.dataValues.idUsers == record.dataValues.idUser){
				await record.destroy();
				return res.status(200).json({ status: 200, msg: "Post bien supprimé" });
			} else {
				return res.status(413).json({ status: 200, msg : "Droits requis"})
			}
		} catch (e) {
			console.error(e)
			return res.status(500).json({ msg: "Erreur lorsde la lecture", status: 500, route: "/post/read/:id" });
		}
	}
}

export default new PostController();