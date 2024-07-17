import { body } from 'express-validator';

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
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
        .withMessage('La date de publication doit être au format YYYY-MM-DD HH:mm:ss')
        .notEmpty()
        .withMessage('La date de publication est requise'),
      body('dateStart')
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
        .withMessage('La date de début doit être au format YYYY-MM-DD HH:mm:ss')
        .notEmpty()
        .withMessage('La date de début est requise'),
      body('dateEnd')
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
        .withMessage('La date de fin doit être au format YYYY-MM-DD HH:mm:ss')
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
        .isBoolean()
        .withMessage('Accepté doit être un booléen')
        .notEmpty()
        .withMessage('Accepté est requis'),
      body('acceptedBy')
        .isInt()
        .withMessage('Accepté par doit être un entier')
        .notEmpty()
        .withMessage('Accepté par est requis'),
      body('idUser')
        .isInt()
        .withMessage('L\'identifiant de l\'utilisateur doit être un entier')
        .notEmpty()
        .withMessage('L\'identifiant de l\'utilisateur est requis'),
      body('idPlant')
        .isInt()
        .withMessage('L\'identifiant de la plante doit être un entier')
        .notEmpty()
        .withMessage('L\'identifiant de la plante est requis')
    ];
  }
}

export default new PostValidator();