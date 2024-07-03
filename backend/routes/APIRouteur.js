const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const plantRoutes = require('./plantRoutes');
const postRoutes = require('./postRoutes');
const picturesRoutes = require('./picturesRoutes');

// Routes pour les utilisateurs
router.use('/user', userRoutes);

// Routes pour les plantes
router.use('/plant', plantRoutes);

// Routes pour les posts
router.use('/post', postRoutes);

// Routes pour les images
router.use('/pic', picturesRoutes);

module.exports = router;