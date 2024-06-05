const express = require('express');
const router = express.Router();
const User = require('../database/models/createUser');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/users', async (req, res) => {
    try {
        const users = await User.all();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
});

router.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const user = new User(null, name, email);

    try {
        await user.save();
        res.json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la création de l\'utilisateur');
    }
});

module.exports = router;
