const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const manageUser = require('../database/models/manageUsers');
const managePlants = require('../database/models/managePlants')
const managePosts = require('../database/models/managePosts')

// Middleware d'authentification pour toutes les routes de l'API
// router.use(verifyToken);

// Routes API

////////////////////////////////////////////////////////////USERS
//get tous les users
router.get('/getUsers', async (req, res) => {
    try{
        const users = await manageUser.getAllUsers();
        res.json(users);
    } catch(e){
        console.error('Erreur lors de la route getUsers : \n',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: '1K3L1J'});
    }
});

//créer user
router.post('/createUser', async (req, res) => {
    try{
        const r = req.body
        const response = await manageUser.addUser(r.lastName,r.firstName,r.email,r.address,r.phone,r.cityName,r.password);
        res.json(response);
    } catch(e){
        console.error('Erreur lors de la route createUser',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: 'DFDS47'});
    }
});

router.post('/updateUser', async (req, res) => {
    try{
        const r = req.body
        const response = await manageUser.updateUser(r.uid, r.lastName,r.firstName,r.email,r.address,r.phone,r.cityName);
        res.json(response);
    } catch(e){
        console.error('Erreur lors de la route updateUser',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: 'SDF6'});
    }
});

////////////////////////////////////////////////////////////PLANTES
//créer plante
router.post('/createPlant', async (req, res) => {
    try{
        const r = req.body;
        const users = await managePlants.addPlant(r.description, r.origin, r.requirements, r.type);
        res.json(users);
    } catch(e){
        console.error('Erreur lors de la route createPlant : \n',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: 'EAZ132'});
    }
});

//get 1 plante
router.get('/getPlantWithID', async (req, res) => {
    try{
        const response = await managePlants.getPlantWithID(req.body.plantID);
        res.json(response);
    } catch(e){
        console.error('Erreur lors de la route getPlantWithID : \n',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: 'VC56B'});
    }
})

////////////////////////////////////////////////////////////POSTS
//créer post
router.post('/createPost', async (req, res) => {
    try{
        const r = req.body
        const response = await managePosts.addPost(r.title, r.description, r.dateStart, r.dateEnd, r.address, r.cityName, r.idUser, r.idPlant);
        res.json(response);
    } catch(e){
        console.error('Erreur lors de la route createPost : \n',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: 'QA1'});
    }
});

//get tous les posts
router.get('/getPosts', async (req, res) => {
    try{
        const response = await managePosts.getAllPosts();
        res.json(response);
    } catch(e){
        console.error('Erreur lors de la route getPosts : \n',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: '1LIJ'});
    }
})

router.get('/connexion'), async(req,res)=>{
    try{
        const r = req.body
        const response = await manageUser.connexion(r.email,r.password)
        res.json(response)
    } catch(e){
        console.error('Erreur lors de la route connexion : \n',e)
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: '1TR3'});
    }
}

module.exports = router;
