const express = require('express');
const bodyParser = require('body-parser');
const api = require('../components/API');
const { PORT } = require('../config/config');
const sqlite3 = require('sqlite3');
const User = require('../database/models/createUser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const dbPath = path.resolve(__dirname, '../database/database.sqlite');
const sqlPath = path.resolve(__dirname, '../database/index.sql');

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
      console.log('Contenu du fichier index.sql :\n', initSQL); // Ajoutez cette ligne pour afficher le contenu du fichier
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

app.use(express.static(path.resolve(__dirname, '../../Web/Public')));

app.get('/', (req, res) => {
  res.sendFile('Index.html', { root: path.resolve(__dirname, '../../Web/Public') });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.all(db);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const user = new User(null, name, email);

  try {
    await user.save(db);
    res.json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création de l\'utilisateur');
  }
});

app.use('/api', api);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
