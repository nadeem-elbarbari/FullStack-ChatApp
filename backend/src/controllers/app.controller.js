import cookieParser from 'cookie-parser';
import { connectDb } from '../database/db.js';
import { errorHandler } from '../middleware/errors.middleware.js';
import authRouter from '../routes/auth.route.js';
import messageRouter from '../routes/message.route.js';
import successResponse from '../middleware/success.middleware.js';
import cors from 'cors';

const boostrap = (app, express) => {
    app.use(express.json());

    app.use(successResponse);

    app.use(
        cors({
            origin: 'http://localhost:5173',
            credentials: true,
        })
    );

    app.use(cookieParser());

    app.use('/api/auth', authRouter);

    app.use('/api/messages', messageRouter);

    connectDb();

    app.use(errorHandler);
};

export default boostrap;
