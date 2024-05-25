// Un middleware = fonction qui accède à "req", "res" et "next()" -> POUR éxecuter du code, modifier les objets, finir une requete, appeler une fonction middleware dans la pile
// Middleware d'authentification simple pour vérifier un token
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' }); // Pas de token
    }
    // Vérification du token (simulé ici)
    if (token !== 'your-secure-token') {
        return res.status(401).json({ message: 'Failed to authenticate token' }); // Échec d'authentification
    }
    next();
}

module.exports = { verifyToken };
