const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const apiRouter = require('./routes/APIRouteur');
const { PORT } = require('./config/config');
const { apiLimiter } = require('./middlewares/apiLimiter');

const app = express();
app.use(bodyParser.json());

// MiddleWare pour limiter les requetes à l'API
app.use('/api', apiLimiter);

// Pour les routes API
app.use('/api', apiRouter);

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.resolve(__dirname, '..', 'Web', 'Public')));
app.use('/page', express.static(path.resolve(__dirname, '..', "Web","page")))
app.use('/asset', express.static(path.resolve(__dirname, '..', "Web","asset")))
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.resolve(__dirname, '..', '..', 'Web', 'Public') });
});



// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});