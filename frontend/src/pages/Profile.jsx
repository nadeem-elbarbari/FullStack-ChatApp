import React from 'react';
import { Camera, Key, LucideLoader, Mail, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import Loader from '../components/Loader.jsx';

const Profile = () => {
    const { isUpdatingProfile, user, updateProfileImage } = useAuthStore();

    const [previewImage, setPreviewImage] = React.useState(user?.profilePic?.secure_url || '/avatar.png');

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        setPreviewImage(URL.createObjectURL(file)); // Show preview immediately

        await updateProfileImage(file);
    };
    return (
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">
                            <span className="text-2xl"> {user?.fullName}</span>
                        </h1>
                    </div>

                    {/* Avatar Upload */}
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative">
                                <img
                                    src={previewImage}
                                    alt="Profile"
                                    className="size-32 rounded-full object-cover border-4 border-secondary"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`absolute bottom-0 right-0 bg-secondary hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                                        isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''
                                    }`}
                                >
                                    {isUpdatingProfile ? (
                                        <LucideLoader className="w-5 h-5 text-base-100 animate-spin animate-infinite" />
                                    ) : (
                                        <Camera className="w-5 h-5 text-base-100" />
                                    )}
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUpdatingProfile}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}

                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <div className="text-sm flex items-center gap-2 text-base-content">
                            <User className="w-4 h-4 text-primary" />
                            الاسم
                        </div>
                        <p dir='ltr' className="px-4 py-2.5 rounded-lg bg-base-200">{user?.fullName}</p>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                        <div className="text-sm flex items-center gap-2 text-base-content">
                            <Mail className="w-4 h-4 text-primary" />
                            البريد الالكتروني
                        </div>
                        <p dir='ltr' className="px-4 py-2.5 rounded-lg bg-base-200">{user?.email}</p>
                    </div>

                    {/* User id */}
                    <div className="space-y-1.5">
                        <div className="text-sm flex items-center gap-2 text-base-content">
                            <Key className="w-4 h-4 text-primary" />
                            كود الهوّية
                        </div>
                        <p dir='ltr' className="px-4 py-2.5 rounded-lg bg-base-200">{user?._id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
