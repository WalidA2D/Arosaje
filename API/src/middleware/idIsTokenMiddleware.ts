import { Request, Response, NextFunction } from 'express';
import { UserInstance } from '../models/User';

function idIsToken() {
    return async(req:Request, res:Response, next:NextFunction)=>{
        const token = req.headers.authorization?.split(' ')[0];
        if(!token){
            return res.status(401).json({error:"Aucun token fourni"})
        }
        try{
            const { id } = req.query
            if(!id) return res.status(401).json({error: "Aucun id fourni"});
            const user = await UserInstance.findOne({where : {uid:token}})
            if(user?.dataValues.idUsers.toString() == id){
                next()
            } else {
                return res.status(404).json({error: 'Non autorisé, Token invalide.'})
            }
        } catch (e) {
            return res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
}

export default idIsToken;