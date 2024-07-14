import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

import { UserInstance } from "../models/user";

class UserController {
	async create(req: Request, res: Response) {
		const uid = uuidv4();
		try {
			const email = await UserInstance.findOne({where: {email : req.body.email}})
			if(email != null){
				return res.status(417).json({msg: "Email déjà existant", status:417});
			}
			const record = await UserInstance.create({ ...req.body, uid });
			return res.status(200).json({ record, msg: "Création utilisateur ok" });
		} catch (e) {
			return res.status(417).json({ msg: "Création utilisateur échouée", status: 417, route: "/create", e });
		}
	}

	async readPagination(req: Request, res: Response) {
		try {
			const limit = (req.query.limit as number | undefined) || 10;
			const offset = req.query.offset as number | undefined;

			const records = await UserInstance.findAll({ where: {}, limit, offset });
			return res.status(200).json({ users : records });
		} catch (e) {
			return res.status(500).json({ msg: "Lecture fail", status: 500, route: "/read" });
		}
	}
	async readByID(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await UserInstance.findOne({ where: { idUsers : id } });
			return res.status(200).json(record);
		} catch (e) {
			return res.status(500).json({ msg: "Lecture byId fail", status: 500, route: "/read/:id" });
		}
	}
	// async update(req: Request, res: Response) {
	// 	try {
	// 		const { id } = req.params;
	// 		const record = await UserInstance.findOne({ where: { id } });

	// 		if (!record) {
	// 			return res.json({ msg: "Cible non trouvée" });
	// 		}

	// 		const updatedRecord = await record.update({
	// 			completed: !record.getDataValue("completed"),
	// 		});
	// 		return res.json({ record: updatedRecord });
	// 	} catch (e) {
	// 		return res.json({
	// 			msg: "fail to read",
	// 			status: 500,
	// 			route: "/update/:id",
	// 		});
	// 	}
	// }
	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await UserInstance.findOne({ where: { idUsers : id } });

			if (!record) {
				return res.status(500).json({ status : 500, msg: "Can not find existing record" });
			}

			const deletedRecord = await record.destroy();
			return res.status(200).json({ record: deletedRecord });
		} catch (e) {
			return res.status(200).json({
				msg: "fail to read",
				status: 500,
				route: "/delete/:id",
			});
		}
	}
}

export default new UserController();