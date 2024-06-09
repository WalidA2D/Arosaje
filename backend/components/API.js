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
    }
});

//get 1 plante
router.get('/getPlantWithID', async (req, res) => {
    try{
        const response = await managePlants.getPlantWithID(req.body.plantID);
        res.json(response);
    } catch(e){
        console.error('Erreur lors de la route getPlantWithID : \n',e)
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
    }
});

//get tous les posts
router.get('/getPosts', async (req, res) => {
    try{
        const response = await managePosts.getAllPosts();
        res.json(response);
    } catch(e){
        console.error('Erreur lors de la route getPosts : \n',e)
    }
})

module.exports = router;
