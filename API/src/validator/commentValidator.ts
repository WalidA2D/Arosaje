import { body, param, query } from 'express-validator';

class CommentValidator {
    checkCreate() {
        return [
            body('text')
                .isString()
                .withMessage('Le texte doit être une chaîne de caractères')
                .notEmpty()
                .withMessage('Le texte est requis'),
            body('note')
                .optional()
                .isFloat({ min: 0, max: 5 })
                .withMessage('La note doit être un nombre décimal entre 0 et 5'),
            body('publishedAt')
                .optional()
                .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
                .withMessage('La date de publication doit être au format YYYY-MM-DD HH:mm:ss'),
            body('idPost') 
                .isInt()
                .withMessage("L'IdPost doit etre un entier")
        ];
    }
    checkRead() {
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
    checkReadByPost() {
        return [
            param('id')
                .notEmpty().withMessage('Id du post doit être fourni')
                .isInt()
                .withMessage("L'id du post doit être un numéro")
        ];
    }
}

export default new CommentValidator();
