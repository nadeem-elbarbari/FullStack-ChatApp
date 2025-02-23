import { NODE_ENV } from "../../config/env.js";

export const errorHandler = (err, req, res, next) => {
    res.status(parseInt(err.cause) || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: NODE_ENV === 'development' && err.stack || null,
    });
};
