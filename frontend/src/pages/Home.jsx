import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import NoChatSelected from '../components/NoChatSelected.jsx';
import Chat from '../components/Chat.jsx';
import { useChatStore } from '../../store/useChatStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';

const Home = () => {
    const { selectedUser } = useChatStore();
    const { connectSocket, disconnectSocket } = useAuthStore();

    useEffect(() => {
        connectSocket(); // Connect to Socket.io on mount
        return () => disconnectSocket(); // Disconnect on unmount
    }, []);

    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar />
                        {!selectedUser ? <NoChatSelected /> : <Chat />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
