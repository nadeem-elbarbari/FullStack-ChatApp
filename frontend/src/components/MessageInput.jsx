import { useRef, useState, useMemo } from 'react';
import { useChatStore } from '../../store/useChatStore.js';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    // Generate preview URL for the image
    const attachmentPreview = useMemo(() => (attachment ? URL.createObjectURL(attachment) : null), [attachment]);

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.includes('image')) {
            toast.error('الصورة غير صالحة');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            // 5MB limit
            toast.error('2MB كحد اقصى للصورة');
            return;
        }

        setAttachment(file);
    };

    const removeImage = () => {
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Only access if it exists
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !attachment) return;

        try {
            await sendMessage(text, attachment);
            setText('');
            removeImage();
        } catch (error) {
            console.error('Error in MessageInput:', error);
            toast.error(error.response?.data?.message || 'فشل ارسال الرسالة');
        }
    };

    return (
        <div className="p-4 w-full">
            {/* Image Preview */}
            {attachment && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={attachmentPreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex items-center flex-1 gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="اكتب رسالتك هنا..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!!attachment}
                        className={`btn btn-circle hidden sm:flex ${attachment ? 'text-emerald-400' : 'text-primary'}`}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button type="submit" className="btn btn-circle btn-primary" disabled={!text.trim() && !attachment}>
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
