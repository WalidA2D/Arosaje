const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

// Exemple de fonction API sécurisée
router.post('/data', verifyToken, (req, res) => {
    const data = req.body.data;
    res.status(200).json({ message: 'Data received', data });
});

module.exports = router;