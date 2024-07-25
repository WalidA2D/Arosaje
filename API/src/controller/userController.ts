import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

import { UserInstance } from "../models/User";
import { encryptMethod } from "../helpers/encryptMethod";

class UserController {
	async create(req: Request, res: Response) {
		const uid = uuidv4();
		try {
			const email = await UserInstance.findOne({where: {email : req.body.email}})
			if(email != null){
				return res.status(417).json({msg: "Email déjà existant", status:417});
			}
			req.body.password = await encryptMethod(req.body.password);
			const record = await UserInstance.create({ ...req.body, uid });
			return res.status(201).json({ record, msg: "Création utilisateur ok" });
		} catch (e) {
			console.error(e)
			return res.status(417).json({ msg: "Création utilisateur échouée", status: 417, route: "/create" });
		}
	}

	async readPagination(req: Request, res: Response) {
		try {
			const amont = (req.query.amont as number | undefined) || 10;
			const saut = req.query.saut as number | undefined;
			const records = await UserInstance.findAll({ where: {}, limit: amont, offset: saut });
			return res.status(200).json({ users : records });
		} catch (e) {
			console.error(e)
			return res.status(500).json({ msg: "Lecture fail", status: 500, route: "/read" });
		}
	}
	async readByID(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await UserInstance.findOne({ where: { idUsers : id } });
			if(!record) return res.status(404).json({msg:"Utilisateur introuvable"})
			return res.status(200).json({record});
		} catch (e) {
			console.error(e)
			return res.status(500).json({ msg: "Lecture byId fail", status: 500, route: "/read/:id" });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const token = req.headers.authorization?.split(' ')[0];
			const record = await UserInstance.findOne({ where: { uid:token } });
			if (!record) {
				return res.status(404).json({ msg: "Cible non trouvée" });
			}
			const { lastName, firstName, email, address, phone, cityName, password } = req.body
			const encryptedPassword = await encryptMethod(password);
			const updatedRecord = await record.update({
					lastName,
					firstName,
					email,
					address,
					phone,
					cityName,
					password: encryptedPassword
				});
			return res.json({ msg:"Modificaiton réussie",record: updatedRecord });
		} catch (e) {
            console.error(e)
			return res.status(500).json({ msg: "Modification impossible", route: "/update/:id" });
		}
	}

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
            console.error(e)
			return res.status(200).json({ msg: "fail to read", status: 500, route: "/delete/:id" });
		}
	}
	
	async connexion(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await UserInstance.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ msg: "Utilisateur non trouvé" });
            }
            const encryptedPassword = await encryptMethod(password);
            if (user.dataValues.password !== encryptedPassword) {
                return res.status(401).json({ msg: "Mot de passe incorrect" });
            }
            return res.status(200).json({ msg: "Connexion réussie", user });
        } catch (e) {
            console.error(e)
            return res.status(500).json({ msg: "Erreur lors de la connexion", status: 500, route: "/login" });
        }
    }
}

export default new UserController();