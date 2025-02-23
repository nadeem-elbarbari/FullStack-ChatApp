import bcrypt from 'bcrypt';
import { SALT } from '../../config/env.js';

export const hashPassword = (password) => bcrypt.hashSync(password, parseInt(SALT));

export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);