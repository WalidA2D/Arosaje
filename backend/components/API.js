const express = require('express'); // Framework web
const router = express.Router();
const { verifyToken } = require('../middlewares/auth'); // Middleware d'authentification

// Exemple de fonction API sécurisée
router.post('/data', verifyToken, (req, res) => {
    const data = req.body.data;
    // Traitement de la donnée...
    res.status(200).json({ message: 'Data received', data });
});

module.exports = router;
