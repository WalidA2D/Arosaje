const express = require('express');
const router = express.Router();
const manageUser = require('../database/models/manageUsers');

// Middleware d'authentification pour toutes les routes des utilisateurs
// router.use(verifyToken);

router.get('/getUsers', async (req, res) => {
    try {
        const users = await manageUser.getAllUsers();
        res.json(users);
    } catch (e) {
        console.error('Erreur lors de la route getUsers : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: '1K3L1J' });
    }
});

router.post('/createUser', async (req, res) => {
    try {
        const r = req.body;
        const response = await manageUser.addUser(r.lastName, r.firstName, r.email, r.address, r.phone, r.cityName, r.password);
        res.json(response);
    } catch (e) {
        console.error('Erreur lors de la route createUser', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: 'DFDS47' });
    }
});

router.post('/updateUser', async (req, res) => {
    try {
        const r = req.body;
        const response = await manageUser.updateUser(r.uid, r.lastName, r.firstName, r.email, r.address, r.phone, r.cityName);
        res.json(response);
    } catch (e) {
        console.error('Erreur lors de la route updateUser', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: 'SDF6' });
    }
});

router.post('/connexion', async (req, res) => {
    try {
        const r = req.body;
        const response = await manageUser.connexion(r.email, r.password);
        res.json(response);
    } catch (e) {
        console.error('Erreur lors de la route connexion : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur', IDEr: '1TR3' });
    }
});

module.exports = router;
