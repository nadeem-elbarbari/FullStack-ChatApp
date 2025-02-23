import jwt from 'jsonwebtoken';
import { JWT_EXP, NODE_ENV } from '../../config/env.js';

const generateToken = (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: JWT_EXP });

    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevents XSS attacks by client side scripts
        sameSite: 'strict',
        secure: NODE_ENV === 'production',
    });

    return token;
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export { generateToken, verifyToken };
