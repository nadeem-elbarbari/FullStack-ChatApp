import mongoose from 'mongoose';

const UserRole = {
    USER: 'user',
    ADMIN: 'admin',
};

const Provider = {
    GOOGLE: 'google',
    SYSTEM: 'system',
};

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 20,
        },

        email: {
            type: String,
            required: function () {
                return this.provider === Provider.SYSTEM;
            },
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: function () {
                return this.provider === Provider.SYSTEM;
            },
            minLength: 8,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },

        provider: {
            type: String,
            enum: Object.values(Provider),
            default: Provider.SYSTEM,
        },

        profilePic: {
            secure_url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
