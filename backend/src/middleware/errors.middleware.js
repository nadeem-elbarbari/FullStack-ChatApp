import { NODE_ENV } from '../../config/env.js';

export const errorHandler = (err, req, res, next) => {
    if (NODE_ENV === 'development') {
        res.status(parseInt(err.cause) || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
            stack:  err.stack,
        });
    } else {
        res.status(parseInt(err.cause) || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
        });
    }
};
