import { body, param, query } from 'express-validator';

class UserValidator {
	checkCreate() {
		return [
			body('lastName')
            .notEmpty().withMessage('Le prénom est vide')
            .isString().withMessage('Nom invalide'),
            body('firstName')
				.notEmpty().withMessage('Le prénom est vide')
                .isString().withMessage('Prénom invalide'),
            body('email')
                    .notEmpty()
                    .isEmail()
                    .withMessage('Email invalide'),
			// body('??')
			// 	.optional()
			// 	.isBoolean()
			// 	.withMessage('The value should be boolean')
			// 	.isIn([0, false])
			// 	.withMessage('The value should be 0 or false'),
		];
	}
	checkRead() { //avec pagination
		return [
			query('limit')
				.optional()
				.isInt({ min: 1, max: 10 })
				.withMessage('La limite doit être entre : 1 à 10'),
			query('offset')
				.optional()
				.isNumeric()
				.withMessage('La valeur doit être un numéro'),
		];
	}
    checkIdParam() {
        return [
			param('id')
				.notEmpty()
				.withMessage('La valeur est vide')
		];
    }
}

export default new UserValidator();