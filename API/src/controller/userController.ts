import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

import { UserInstance } from "../models/User";
import { encryptMethod } from "../helpers/encryptMethod";

const defaultPP = "https://firebasestorage.googleapis.com/v0/b/api-arosa-je.appspot.com/o/constants%2Fdefault_pp.jpeg?alt=media&token=c777b8c6-7342-4165-9c0f-7ad9ed91ca3b"

class UserController {
  async create(req: Request, res: Response) {
    const uid = uuidv4();
    try {
      const email = await UserInstance.findOne({ where: { email: req.body.email } });
      if (email != null) return res.status(417).json({ success: false, msg: "Email déjà existant" });
      req.body.password = await encryptMethod(req.body.password);
      const u = (await UserInstance.create({ ...req.body, uid, photo: defaultPP })).dataValues;
      return res.status(201).json({ success: true, record : {
        "idUsers":u.idUsers,
        "lastName": u.lastName,
        "firstName": u.firstName,
        "email": u.email,
        "address": u.address,
        "phone": u.phone,
        "cityName": u.cityName,
        "password": u.password,
        "photo": u.photo,
        "role": u.isBotanist?"Botaniste":u.isAdmin?"Administrateur":"Utilisateur",
        "isBan": u.isBan?true:false,
        "note": u.note,
        "uid": u.uid
      }, msg: "Création utilisateur ok" });
    } catch (e) {
      console.error(e);
      return res.status(417).json({ success: false, msg: "Création utilisateur échouée" });
    }
  }
  
  async readOwnProfile(req: Request, res: Response){
    try{
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Cible non trouvée" });
      const role = user.dataValues.isAdmin ? "Administrateur" : user.dataValues.isBotanist ? "Botaniste" : "Utilisateur" ;
      return res.status(200).json({ success:true, msg: "Lecture du profil OK", user:{
        idUsers:user.dataValues.idUsers,
        lastName:user.dataValues.lastName,
        firstName:user.dataValues.firstName,
        email:user.dataValues.email,
        address:user.dataValues.address,
        phone:user.dataValues.phone,
        cityName:user.dataValues.cityName,
        photo:user.dataValues.photo,
        role,
        note:user.dataValues.note,
      }})
    } catch (e){
      console.error(e);
      return res.status(417).json({ success: false, msg: "Lecture du profil échouée" });
    }
  }

  async readPagination(req: Request, res: Response) {
    try {
      const amont = (req.query.amont as number | undefined) || 10;
      const saut = req.query.saut as number | undefined;
      const records = await UserInstance.findAll({ where: {}, limit: amont, offset: saut });
      return res.status(200).json({ success: true, users: records });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Lecture fail" });
    }
  }
  async readByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserInstance.findOne({ where: { idUsers: id } });
      if (!user)
        return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      return res.status(200).json({ success:true, msg: "Lecture du profil OK", user:{
        idUser:user.dataValues.idUsers,
        lastName:user.dataValues.lastName,
        firstName:user.dataValues.firstName,
        cityName:user.dataValues.cityName,
        role:user.dataValues.isAdmin?'Administrateur':user.dataValues.isBotanist?'Botaniste':'Utilisateur',
        profilePic:user.dataValues.photo
      }})
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Lecture byId fail" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[0];
      const record = await UserInstance.findOne({ where: { uid: token } });
      if (!record) return res.status(404).json({ success: false, msg: "Cible non trouvée" });
      const { lastName, firstName, email, address, phone, cityName } = req.body;
      // const encryptedPassword = await encryptMethod(password);
      const updatedRecord = await record.update({
        lastName,
        firstName,
        email,
        address,
        phone,
        cityName,
        // password: encryptedPassword,
      });
      return res.status(200).json({ success: true, msg: "Modification réussie", record: updatedRecord });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Modification impossible" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const record = await UserInstance.findOne({ where: { idUsers: id } });

      if (!record) return res.status(500).json({ success: false, msg: "Can not find existing record" });

      const deletedRecord = await record.destroy();
      return res.status(200).json({ success: true, record: deletedRecord });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "fail to read" });
    }
  }

  async connexion(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await UserInstance.findOne({ where: { email } });
      if (!user) return res.status(401).json({ success: false, msg: "Utilisateur non trouvé" });
      const encryptedPassword = await encryptMethod(password);
      if (user.dataValues.password !== encryptedPassword) return res.status(401).json({ success: false, msg: "Mot de passe incorrect" });
      return res.status(200).json({ success: true, msg: "Connexion réussie", user });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la connexion" });
    }
  }
}

export default new UserController();