import React from 'react';
import { useThemeStore } from '../../store/useThemeStore.js';
import { themes } from '../themes/themes.js';
import { Send } from 'lucide-react';
const previewTheme = [
    { id: 1, content: "السلام عليكم! عامل إيه؟", isSent: false },
    { id: 2, content: "الحمدلله! بجرب مميزات الموقع 😂", isSent: true },
];
const Settings = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">الألوان</h2>
                    <p className="text-sm text-base-content/70">اختر لونك المفضل للواجهة</p>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {themes.map((t) => (
                        <button
                            key={t}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                                theme === t ? 'bg-base-200' : 'hover:bg-base-200/50'
                            }`}
                            onClick={() => toggleTheme(t)}
                        >
                            <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                    <div className="rounded bg-primary"></div>
                                    <div className="rounded bg-secondary"></div>
                                    <div className="rounded bg-accent"></div>
                                    <div className="rounded bg-neutral"></div>
                                </div>
                            </div>
                            <span className="text-[11px] font-medium truncate w-full text-center">
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Preview Section */}
                <h3 className="text-lg font-semibold mb-3">معاينة</h3>
                <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
                    <div className="p-4 bg-base-200">
                        <div className="max-w-lg mx-auto">
                            {/* Mock Chat UI */}
                            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                                {/* Chat Header */}
                                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                                            NE
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm">Nadeem Ehab</h3>
                                            <p className="text-xs text-base-content/70">متصل</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Chat Messages */}
                                <div className="p-4 space-y-4">
                                    {previewTheme.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.isSent ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`px-4 py-2 rounded-lg ${
                                                    message.isSent ? 'bg-primary text-primary-content' : 'bg-base-300'
                                                }`}
                                            >
                                                {message.content}
                                                <div className="text-xs mt-1">
                                                    {message.isSent ? 'أنت' : 'Nadeem'} -{' '}
                                                    {new Date().toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Chat Input */}
                                <div className="p-4 border-t border-base-300 bg-base-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1 text-sm h-10"
                                            placeholder="اكتب رسالتك هنا..."
                                            readOnly
                                        />
                                        <button className="btn Obtn-primary h-10 min-h-0">
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
