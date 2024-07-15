import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import authMiddleware from './authMiddleware';
import idIsToken from './idIsTokenMiddleware'

const Middleware = {
    authMiddleware,
    handleValidationError: (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    idIsToken,
};

export default Middleware;
