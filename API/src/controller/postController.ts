import { Request, Response } from "express";

import { PostInstance } from "../models/Post";

class PostController {
	async create(req: Request, res: Response) {
		try {
			console.log(req.body)
			const record = await PostInstance.create({ ...req.body });
			console.log(record.dataValues)
			return res.status(200).json({ record, msg: "Création post ok" });
		} catch (e) {
			return res.status(417).json({ msg: "Création post échouée", status: 417, route: "/post/create", e });
		}
	}
}

export default new PostController();