import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import NoChatSelected from '../components/NoChatSelected.jsx';
import Chat from '../components/Chat.jsx';
import { useChatStore } from '../../store/useChatStore.js';

const Home = () => {
    const { selectedUser } = useChatStore(); // FIX: Corrected variable name

    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar />
                        {!selectedUser ? <NoChatSelected /> : <Chat />} {/* FIX: Corrected condition */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
