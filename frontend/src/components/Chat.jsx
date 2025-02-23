import React, { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore.js';
import MessageInput from './MessageInput.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageSkeleton from './MessageSkeleton.jsx';
import { useAuthStore } from '../../store/useAuthStore.js';

const detectLanguage = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text) ? 'lang-ar' : 'lang-en';
};

const Chat = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } =
        useChatStore();
    const { user } = useAuthStore();
    const [messageLanguages, setMessageLanguages] = useState({});
    const messagesEndRef = useRef(null); // For auto-scrolling

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToMessages();
        } else {
            set({ messages: [] }); // Reset messages when no user is selected
        }

        return () => unsubscribeFromMessages();
    }, [selectedUser]);

    useEffect(() => {
        const detectedLanguages = {};
        messages?.forEach((message) => {
            if (message?.message) {
                detectedLanguages[message._id] = detectLanguage(message.message);
            }
        });
        setMessageLanguages(detectedLanguages);
    }, [messages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!selectedUser) return <div className='loading-spinner m-auto animate-spin'></div>;

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-y-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    const formatDate = (date) => {
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isToday = messageDate.toDateString() === today.toDateString();
        const isYesterday = messageDate.toDateString() === yesterday.toDateString();

        if (isToday) {
            return `اليوم ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (isYesterday) {
            return `الأمس ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return messageDate.toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <ChatHeader />

            <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                {messages?.filter(Boolean).map((message) => {
                    if (!message || !message._id || !message.sender) return null; // Prevents crashes

                    return (
                        <div
                            key={message._id}
                            className={`chat ${
                                message.sender.toString() === user._id?.toString() ? 'chat-end' : 'chat-start'
                            }`}
                        >
                            <div className="chat-image avatar">
                                <div className="size-[60px] rounded-full overflow-hidden">
                                    <img
                                        src={
                                            message.sender.toString() === user._id.toString()
                                                ? user.profilePic?.secure_url || '/avatar.png'
                                                : selectedUser?.profilePic?.secure_url || '/avatar.png'
                                        }
                                        alt="User avatar"
                                    />
                                </div>
                            </div>

                            <div
                                className={`chat-bubble ${
                                    message.sender.toString() === user._id.toString()
                                        ? 'chat-bubble-primary'
                                        : 'bg-base-300 text-base-content'
                                } flex flex-col ${messageLanguages[message._id] || 'lang-en'}`}
                            >
                                {message.attachment?.secure_url && (
                                    <img
                                        src={message.attachment.secure_url}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                                        loading="lazy"
                                        decoding="async"
                                        width="200"
                                        onClick={() => window.open(message.attachment.secure_url, '_blank')}
                                    />
                                )}
                                {message.message && <p>{message.message}</p>}
                                <div className="chat-header mb-1">
                                    <time className="text-xs opacity-50 ml-1">{formatDate(message.createdAt)}</time>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Invisible div to auto-scroll to last message */}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default Chat;
