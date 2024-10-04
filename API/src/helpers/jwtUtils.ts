import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const generateToken = (userId: string, roles: string[]) => {
    return jwt.sign({ userId, roles }, JWT_SECRET, { expiresIn: '1h' }); // Token expire au bout de : 1 h
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};
