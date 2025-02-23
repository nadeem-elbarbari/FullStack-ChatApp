import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { FileTypes, multerCloud } from '../middleware/multer.js';

const router = Router();

router.post('/signup', auth.signup);

router.post('/login', auth.login);

router.get('/logout', auth.logout);

router.patch('/update-profile-pic', authMiddleware, multerCloud([...FileTypes.IMAGES]).single('profilePic'), auth.updateProfilePic);

router.get('/check-auth', authMiddleware, auth.checkAuth);

router.get('/:userId', authMiddleware, auth.getUserById);

export default router;
