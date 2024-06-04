const express = require('express');
const bodyParser = require('body-parser');
const api = require('../components/API'); // Routes de l'API
const { PORT } = require('../config/config'); // Configuration
const User = require('./models/User'); // Modèle User

const app = express();
app.use(bodyParser.json()); // Utiliser bodyParser pour les JSON

// Connexion à la base de données SQLiiiite
const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données');
    process.exit(1); // Arrêter le processus en cas d'erreur
  }
  console.log('Connexion à la base de données réussie');
});

// Redirection vers l'index public
app.use(express.static('../../Web/Public'));

app.get('/', (req, res) => {
  res.sendFile('Index.html', { root: '../Web/Public' }); // Redirection vers l'index.html
});

// Routes pour gérer les utilisateurs (pour l'instant c'est un exemple)
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

// Routes de l'API

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
