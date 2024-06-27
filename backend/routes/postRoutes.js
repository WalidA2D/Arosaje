const express = require('express');
const router = express.Router();
const managePosts = require('../database/models/managePosts');
const upload = require('../middlewares/uploadConfig');

router.post('/createPost', upload.array('images'), async (req, res) => {
    try {
        const r = req.body;
        const images = req.files.map((file, index) => ({
            title: r.images[index].title,
            url: file.path,
            idPlant: r.idPlant
        }));

        const response = await managePosts.addPost(r.title, r.description, r.dateStart, r.dateEnd, r.address, r.cityName, r.token, images);
        res.json(response);
    } catch (e) {
        console.error('Erreur lors de la route createPost : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur'});
    }
});

router.get('/getPosts', async (req, res) => {
    try {
        const response = await managePosts.getAllPosts();
        res.json(response);
    } catch (e) {
        console.error('Erreur lors de la route getPosts : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur'});
    }
});

router.post('/postsOf', async (req, res) => {
    try {
        const response = await managePosts.postsOf(req.body.idUser);
        res.json(response);
    } catch (e) {
        console.error('Erreur lors de la route postsOf : \n', e);
        res.json({ status: 500, success: false, message: 'Erreur interne du serveur'});
    }
});

module.exports = router;