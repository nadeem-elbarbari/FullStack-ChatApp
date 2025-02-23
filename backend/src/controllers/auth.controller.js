import User from '../database/models/user.model.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/token.js';
import cloudinary from '../utils/cloudinary.js';

export const signup = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    try {
        // check if user already exist
        const isExist = await User.findOne({ email });
        if (isExist) {
            return next(new Error('User already exist', { cause: 409 }));
        }

        const user = await User.create({ fullName, email, password: hashPassword(password) });

        // generate token
        generateToken(res, user._id);

        res.success({ user }, 'User created successfully');

        return;
    } catch (error) {
        console.log('Error in signup controller: ', error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new Error('Invalid credentials'), { cause: 404 });
        }

        const isMatched = comparePassword(password, user.password);

        if (!isMatched) {
            return next(new Error('Invalid credentials'), { cause: 404 });
        }

        generateToken(res, user._id);

        res.success({ user }, 'User logged in successfully');

        return;
    } catch (error) {
        console.log('Error in login controller: ', error);
        next(error);
    }
};

export const logout = (req, res, next) => {
    try {
        res.cookie('token', '', { maxAge: 0 });

        res.success(undefined, 'User logged out successfully');

        return;
    } catch (error) {
        console.log('Error in logout controller: ', error);
        next(error);
    }
};

export const updateProfilePic = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new Error('No file uploaded', { cause: 400 }));
        }

        const { secure_url: profilePicUrl, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/profile-pics/${req.user._id}`,
            public_id: Math.round(Math.random() * 1e9) + '_' + req.user._id,
        });

        await User.findByIdAndUpdate(req.user._id, { profilePic: { secure_url: profilePicUrl, public_id } });

        res.success({ profilePicUrl }, 'Profile pic updated successfully');
        return;
    } catch (error) {
        console.log('Error in update profile pic controller: ', error);
        next(error);
    }
};

export const checkAuth = async (req, res, next) => {
    try {
        return res.success({ user: req.user }, 'User is authenticated');
    } catch (error) {
        console.log('Error in check auth controller: ', error);
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return next(new Error('User not found', { cause: 404 }));
        }

        res.success({ user }, 'User fetched successfully');

        return;
    } catch (error) {
        console.log('Error in get user by id controller: ', error);
        next(error);
    }
};
