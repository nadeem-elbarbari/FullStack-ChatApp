import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env.js';
import User from '../database/models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // check if token exist
        const token = req.cookies.token;

        if (!token) {
            return next(new Error('Unauthorized - Invalid Token', { cause: 401 }));
        }

        // verify token
        const { id } = jwt.verify(token, JWT_SECRET);

        // find user by id
        const user = await User.findById(id).select('-password');

        if (!user) {
            return next(new Error('Unauthorized - Invalid Token', { cause: 401 }));
        }

        // add user to request
        req.user = user;

        next();
    } catch (error) {
        console.log('Error in auth middleware: ', error);
        next(error);
    }
};
