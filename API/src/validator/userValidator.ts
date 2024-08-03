import { body, param, query } from "express-validator";

class UserValidator {
  checkCreate() {
    return [
      body("lastName")
        .notEmpty()
        .withMessage("Le nom de famille est vide")
        .isString()
        .withMessage("Nom de famille invalide"),
      body("firstName")
        .notEmpty()
        .withMessage("Le prénom est vide")
        .isString()
        .withMessage("Prénom invalide"),
      body("email")
        .notEmpty()
        .withMessage("L'email est vide")
        .isEmail()
        .withMessage("Email invalide"),
      body("address")
        .notEmpty()
        .withMessage("L'adresse est vide")
        .isString()
        .withMessage("Adresse invalide"),
      body("phone")
        .notEmpty()
        .withMessage("Le numéro de téléphone est vide")
        .isString()
        .withMessage("Numéro de téléphone invalide"),
      body("cityName")
        .notEmpty()
        .withMessage("Le nom de la ville est vide")
        .isString()
        .withMessage("Nom de la ville invalide"),
      body("password")
        .notEmpty()
        .withMessage("Le mot de passe est vide")
        .isString()
        .withMessage("Mot de passe invalide"),
    ];
  }  
  checkRead() {
    //avec pagination
    return [
      query("limit")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("La limite doit être entre : 1 à 10"),
      query("offset")
        .optional()
        .isNumeric()
        .withMessage("La valeur doit être un numéro"),
    ];
  }
  checkIdParam() {
    return [param("id").notEmpty().withMessage("La valeur est vide")];
  }
  checkLogin() {
    return [
      // query('email').isEmail().withMessage('Email invalide'),
      // query('password').isLength({ min: 6 }).withMessage('Le mot de passe doit comporter au moins 6 caractères')
    ];
  }
}

export default new UserValidator();
