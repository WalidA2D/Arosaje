const rateLimit = require('express-rate-limit');

const privilegedTokens = [
    'waldi',
    'yousbr',
    'BSBx3',
    'handsome'
];

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite par défaut
    privilegedMax: 99000, // Limite pour les tokens privilégiés
    privilegedTokens: privilegedTokens,
    message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard."
});

module.exports = {
    apiLimiter
}