const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const manageUser = require('../database/models/manageUsers');

// Middleware d'authentification pour toutes les routes de l'API
router.use(verifyToken);

// Routes API
router.get('/getUsers', async (req, res) => {
    try{
        const users = await manageUser.getAllUsers();
        res.json(users);
    } catch(e){
        console.error('Erreur lors de la route getUsers : \n',e)
    }
});

router.post('/createUser', async (req, res) => {
    try{
        const userCreated = await manageUser.addUser(req.body.name,req.body.age);
        res.json(userCreated);
    } catch(e){
        console.error('',e)
    }
});

module.exports = router;
