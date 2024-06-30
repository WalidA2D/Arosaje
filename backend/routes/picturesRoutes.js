const express = require('express');
const router = express.Router();
const managePic = require('../database/models/managePictures');

//get une pp selon l'id
router.post('/getPP', async(req,res)=>{
    try{
        const response = await managePic.getProfilePicture(req.body.idUser);
        res.json(response)
    } catch (e){
        console.error('Erreur lors de la route getPP : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur'})
    }
})

//set PP
router.post('/setPP',async(req,res)=>{
    try{
        const response = await managePic.setPP(req.body.token, req.body.file)
        res.json(response)
    } catch (e){
        console.error('Erreur lors de la route setPP : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur'});
    }
})

//reset pp
router.post('/resetPP',async(req,res)=>{
    try{
        const response = await managePic.resetPP(req.body.token)
        res.json(response)
    } catch(e){
        console.error('Erreur lors de la route resetPP : \n',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur'});
    }
})

module.exports = router