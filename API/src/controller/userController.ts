import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

import { UserInstance } from "../models/user";

class UserController {
	async create(req: Request, res: Response) {
		const uid = uuidv4();
		try {
			const record = await UserInstance.create({ ...req.body, uid });
			return res.status(200).json({ record, msg: "Creation user ok" });
		} catch (e) {
			return res.status(417).json({ msg: "Création fail", status: 500, route: "/create", e });
		}
	}

	async readPagination(req: Request, res: Response) {
		try {
			const limit = (req.query.limit as number | undefined) || 10;
			const offset = req.query.offset as number | undefined;

			const records = await UserInstance.findAll({ where: {}, limit, offset });
			return res.json(records);
		} catch (e) {
			return res.json({ msg: "Lecture fail", status: 500, route: "/read" });
		}
	}
	async readByID(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await UserInstance.findOne({ where: { idUsers : id } });
			return res.json(record);
		} catch (e) {
			return res.json({ msg: "Lecture byId fail", status: 500, route: "/read/:id" });
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
				return res.json({ msg: "Can not find existing record" });
			}

			const deletedRecord = await record.destroy();
			return res.json({ record: deletedRecord });
		} catch (e) {
			return res.json({
				msg: "fail to read",
				status: 500,
				route: "/delete/:id",
			});
		}
	}
}

export default new UserController();