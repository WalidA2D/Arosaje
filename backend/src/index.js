const express = require('express'); // Framework web
const bodyParser = require('body-parser'); // Parseur de body JSON
const api = require('../components/API'); // Routes de l'API
const { PORT } = require('../config/config'); // Configuration

const app = express();
app.use(bodyParser.json()); // Utiliser bodyParser pour les JSON

// Redirection vers la page publique
app.use(express.static('../../Web/Public'));

app.get('/', (req, res) => {
    res.sendFile('Index.html', { root: '../Web/Public' }); // Redirection vers Index.html
});

// Routes de l'API
app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;