import { Router } from 'express';
import * as message from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { FileTypes, multerCloud } from '../middleware/multer.js';

const router = Router();

router.get('/users', authMiddleware, message.getUsers);

router.get('/:userId', authMiddleware, message.getMessages);

router.post(
    '/send/:userId',
    authMiddleware,
    multerCloud([...FileTypes.IMAGES]).single('attachment'),
    message.sendMessage
);

export default router;
