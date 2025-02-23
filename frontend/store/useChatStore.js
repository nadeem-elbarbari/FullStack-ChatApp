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
        const socket = useAuthStore.getState().socket;
        const selectedUser = get().selectedUser;

        if (!selectedUser || !socket) return;

        const formData = new FormData();
        formData.append('text', text);

        if (attachment && attachment instanceof File) {
            formData.append('attachment', attachment);
        }

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const newMessage = res.data.newMessage;

            // Update local messages immediately
            set((state) => ({
                messages: [...state.messages, newMessage],
            }));

            // Emit the new message via Socket.io
            socket.emit('sendMessage', newMessage);
        } catch (error) {
            console.error('Error in sendMessage:', error);
            toast.error(error.response?.data?.message || 'Failed to send message');
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.warn('Socket is not available yet.');
            return;
        }

        socket.off('newMessage'); // Prevent duplicate listeners

        socket.on('newMessage', (newMessage) => {
            console.log('New message received:', newMessage);

            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;

        if (!socket) {
            console.warn('Socket is not available, skipping unsubscribe.');
            return; // Prevent crash if socket is null
        }

        socket.off('newMessage'); // Unsubscribe safely
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
