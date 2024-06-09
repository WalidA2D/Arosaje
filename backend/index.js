const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const apiRouter = require('./components/API');
const { PORT } = require('./config/config');

const app = express();
app.use(bodyParser.json());

// Pour les routes API
app.use('/api', apiRouter);

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.resolve(__dirname, '..', 'Web', 'Public')));
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.resolve(__dirname, '..', '..', 'Web', 'Public') });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
