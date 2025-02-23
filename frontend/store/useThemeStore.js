import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'light', // Default theme
    toggleTheme: (theme) => {
        set({ theme });
        localStorage.setItem('theme', theme);
    },
}));
