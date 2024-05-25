//ce fichier sert à garder nos données sensibles et ne pas les exposer dans les fichiers partagés avec le client.
require('dotenv').config(); // Charger les variables d'environnement

module.exports = {
    PORT: process.env.PORT || 3000, // Port du serveur
    DATABASE_URL: process.env.DATABASE_URL // URL de la base de données
};
