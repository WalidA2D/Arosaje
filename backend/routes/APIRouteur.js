const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const plantRoutes = require('./plantRoutes');
const postRoutes = require('./postRoutes');

// Routes pour les utilisateurs
router.use('/user', userRoutes);

// Routes pour les plantes
router.use('/plant', plantRoutes);

// Routes pour les posts
router.use('/post', postRoutes);

module.exports = router;
