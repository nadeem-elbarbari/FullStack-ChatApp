import mongoose from 'mongoose';
import { MONGO_URI } from '../../config/env.js';

export const connectDb = () => {
    mongoose
        .connect(MONGO_URI)
        .then(() => {
            console.log('✅ MongoDB has connected!');
        })
        .catch((err) => {
            console.log('❌ MongoDB connection error: ', err);
        });
};
