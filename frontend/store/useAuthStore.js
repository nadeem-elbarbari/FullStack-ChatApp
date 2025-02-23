import { create } from 'zustand';
import axiosInstance from '../src/utils/axios.js';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const url = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '/';

export const useAuthStore = create((set, get) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsersId: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check-auth');
            set({ user: res.data.data.user });

            get().connectSocket();
        } catch (error) {
            set({ user: null });
            console.log('Error in useAuthStore: ', error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (fullName, email, password) => {
        try {
            set({ isSigningUp: true });
            const res = await axiosInstance.post('/auth/signup', { fullName, email, password });
            toast.success('مبروك 🥳');
            set({ user: res.data.user });

            get().connectSocket();
        } catch (error) {
            set({ user: null });
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (email, password) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post('/auth/login', { email, password });
            const user = res.data.data.user;
            toast.success('نوّرت 😊');

            get().connectSocket();

            set({ user });
        } catch (error) {
            set({ user: null });
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get('/auth/logout');
            toast.success('هتوحشنا 🥹');
            set({ user: null });
            get().disconnectSocket();
        } catch (error) {
            console.log('Error in logout useAuthStore: ', error);
        }
    },

    updateProfileImage: async (file) => {
        try {
            set({ isUpdatingProfile: true });

            const formData = new FormData();
            formData.append('profilePic', file);

            const res = await axiosInstance.patch('/auth/update-profile-pic', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('تم تحديث الصورة');
            set((state) => ({
                user: { ...state.user, profilePic: res.data.profilePic },
            }));
        } catch (error) {
            console.log('Error in updateProfileImage:', error);
            toast.error('فشل تحديث الصورة' || 'Failed to update profile image');
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { user } = get();

        if (!user || get().socket?.connected) return;

        const socket = io(url, {
            query: { userId: user._id },
        });

        socket.connect();
        set({ socket });

        socket.on('onlineUsers', (onlineUsersId) => {
            set({ onlineUsersId });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
