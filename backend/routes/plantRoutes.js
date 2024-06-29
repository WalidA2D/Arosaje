const express = require('express');
const router = express.Router();
const managePlants = require('../database/models/managePlants');

router.post('/createPlant', async (req, res) => {
    try {
        const r = req.body;
        const response = await managePlants.addPlant(r.description, r.origin, r.requirements, r.type);
        res.json(response);
    } catch (e) {
        console.error('Erreur lors de la route createPlant : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur'});
    }
});

router.get('/getPlantWithID', async (req, res) => {
    try {
        const response = await managePlants.getPlantWithID(req.body.plantID);
        res.json(response);
    } catch (e) {
        console.error('Erreur lors de la route getPlantWithID : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur'});
    }
});

module.exports = router;