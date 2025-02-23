import React, { useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { Users } from 'lucide-react';
import SidebarSkeleton from './Skeletons.jsx';

const Sidebar = () => {
    const { getUsers, selectedUser, setSelectedUser, users, isUsersLoading } = useChatStore();
    const { onlineUsersId, socket } = useAuthStore();

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 p-5 w-full">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">الأعضاء</span>
                </div>
            </div>
            <div className="overflow-y-auto w-full py-3">
                {users.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`
                            w-full p-3 flex items-center gap-3
                            hover:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
                        `}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user?.profilePic?.secure_url || '/avatar.png'}
                                alt={user?.profilePic?.public_id}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsersId.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900 bg-green-500" />
                            )}
                        </div>
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user?.fullName}</div>
                            <div
                                dir='rtl'
                                className={`text-sm ${
                                    onlineUsersId.includes(user._id) ? 'text-primary' : 'text-zinc-400'
                                }`}
                            >
                                {onlineUsersId.includes(user._id) ? 'متصل' : 'غير متصل'}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
