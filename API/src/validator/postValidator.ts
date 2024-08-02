import { body, query, param } from 'express-validator';

class PostValidator {
  checkCreate() {
    return [
      body('title')
        .isString()
        .withMessage('Le titre doit être une chaîne de caractères')
        .notEmpty()
        .withMessage('Le titre est requis'),
      body('description')
        .isString()
        .withMessage('La description doit être une chaîne de caractères')
        .notEmpty()
        .withMessage('La description est requise'),
      body('publishedAt')
        .optional()
        .isISO8601()
        .withMessage('La date de publication doit être au format ISO 8601')
        .notEmpty()
        .withMessage('La date de publication est requise'),
      body('dateStart')
        .isISO8601()
        .withMessage('La date de début doit être au format ISO 8601')
        .notEmpty()
        .withMessage('La date de début est requise'),
      body('dateEnd')
        .isISO8601()
        .withMessage('La date de fin doit être au format ISO 8601')
        .notEmpty()
        .withMessage('La date de fin est requise'),
      body('address')
        .isString()
        .withMessage('L\'adresse doit être une chaîne de caractères')
        .notEmpty()
        .withMessage('L\'adresse est requise'),
      body('cityName')
        .isString()
        .withMessage('Le nom de la ville doit être une chaîne de caractères')
        .notEmpty()
        .withMessage('Le nom de la ville est requis'),
      body('state')
        .isBoolean()
        .withMessage('L\'état doit être un booléen')
        .notEmpty()
        .withMessage('L\'état est requis'),
      body('accepted')
        .optional()
        .isBoolean()
        .withMessage('Accepté doit être un booléen')
        .notEmpty()
        .withMessage('Accepté est requis'),
      body('acceptedBy')
        .optional()
        .isInt()
        .withMessage('Accepté par doit être un entier')
        .notEmpty()
        .withMessage('Accepté par est requis'),
      body('idUser')
        .isEmpty()
        .withMessage('L\'identifiant de l\'utilisateur ne peut pas être ajouté par un tiers'),
      body('plantOrigin')
        .isString()
        .withMessage('L\'origine de la plante doit être une chaîne de caractères')
        .notEmpty()
        .withMessage('L\'origine de la plante est requise'),
      body('plantRequirements')
        .isString()
        .withMessage('Les besoins de la plante doivent être une chaîne de caractères')
        .notEmpty()
        .withMessage('Les besoins de la plante sont requis'),
      body('plantType')
        .isString()
        .withMessage('Le type de plante doit être une chaîne de caractères')
        .notEmpty()
        .withMessage('Le type de plante est requis')
    ];
  }

  checkRead() {
    return [
      query('limit')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('La limite doit être entre 1 et 10'),
      query('offset')
        .optional()
        .isInt()
        .withMessage('La valeur de l\'offset doit être un nombre entier'),
    ];
  }

  checkIdParam() {
    return [
      param('id')
        .isInt()
        .withMessage("L'id doit être un nombre entier")
    ];
  }
}

export default new PostValidator();
