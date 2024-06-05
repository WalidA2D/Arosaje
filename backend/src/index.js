const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const apiRouter = require('../components/API');
const { PORT, DATABASE_URL } = require('../config/config');
const sqlite3 = require('sqlite3').verbose();

// Initialiser l'application express
const app = express();
app.use(bodyParser.json());

// Configurer la base de données SQLite
const dbPath = path.resolve(__dirname, '..', DATABASE_URL);
const sqlPath = path.resolve(__dirname, '..', 'database', 'index.sql');

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données : ', err);
    process.exit(1);
  }
  console.log('Connexion à la base de données réussie');

  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'existence de la table : ', err);
      process.exit(1);
    }
    if (!row) {
      console.log('La table n\'existe pas, exécution du script SQL pour créer la table.');
      const initSQL = fs.readFileSync(sqlPath, 'utf-8');
      db.exec(initSQL, (err) => {
        if (err) {
          console.error('Erreur lors de l\'initialisation de la base de données : ', err);
        } else {
          console.log('Base de données initialisée avec succès');
        }
      });
    } else {
      console.log('La table existe déjà, aucune action nécessaire.');
    }
  });
});

// Définir les routes API
app.use('/api', apiRouter);

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.resolve(__dirname, '..', '..', 'Web', 'Public')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.resolve(__dirname, '..', '..', 'Web', 'Public') });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

module.exports = app;
