import toast from 'react-hot-toast';
import { create } from 'zustand';
import axiosInstance from '../src/utils/axios.js';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        try {
            set({ isUsersLoading: true });
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data.data.users });
        } catch (error) {
            console.log('Error in useMsgStore: ', error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        try {
            set({ isMessagesLoading: true });
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data.data.messages });
        } catch (error) {
            console.log('Error in useMsgStore: ', error);
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (text, attachment) => {
        const formData = new FormData();
        formData.append('text', text);

        if (attachment && attachment instanceof File) {
            formData.append('attachment', attachment);
        }

        try {
            const res = await axiosInstance.post(`/messages/send/${get().selectedUser._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const newMessage = res.data.newMessage;

            // Update messages immediately
            set({
                messages: [...get().messages, newMessage],
            });
        } catch (error) {
            console.error('Error in useMsgStore: ', error);
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on('newMessage', (newMessage) => {
            // if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
