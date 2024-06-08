function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' }); // Pas de token
    }
    
    //simulation
    if (token !== 'your-secure-token') {
        return res.status(401).json({ message: 'Failed to authenticate token' }); // Échec d'authentification
    }
    next();
}

module.exports = { verifyToken };
