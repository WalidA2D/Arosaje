const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const manageUser = require('../database/models/manageUsers');

// Middleware d'authentification pour toutes les routes de l'API
router.use(verifyToken);

// Routes API
router.get('/getUsers', async (req, res) => {
    const users = await manageUser.getAllUsers();
    res.json(users);
});

router.post('/createUser', async (req, res) => {
    const userCreated = await manageUser.addUser(req.body.name,req.body.age);
    res.json(userCreated);
});

module.exports = router;
