import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, roles: string[]) => {
    const JWT_SECRET = process.env.JWT_SECRET || '';
    return jwt.sign({ userId, roles }, JWT_SECRET, { expiresIn: '2h' }); // Token expire au bout de : 2 h
};

export const verifyToken = (token: string) => {
    const JWT_SECRET = process.env.JWT_SECRET || '';
    return jwt.verify(token, JWT_SECRET);
};