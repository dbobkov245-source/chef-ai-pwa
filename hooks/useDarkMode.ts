'use client';

import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

function useDarkMode(): [boolean, () => void] {
    const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('chef-ai-dark-mode', false);
    const [mounted, setMounted] = useState(false);

    // Handle initial mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Apply dark mode class to document
    useEffect(() => {
        if (!mounted || typeof window === 'undefined') return;

        const root = window.document.documentElement;

        if (isDarkMode) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
    }, [isDarkMode, mounted]);

    // Check system preference on mount
    useEffect(() => {
        if (!mounted || typeof window === 'undefined') return;

        // Only set from system preference if no stored preference exists
        const storedPreference = window.localStorage.getItem('chef-ai-dark-mode');
        if (storedPreference === null) {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(systemPrefersDark);
        }
    }, [mounted, setIsDarkMode]);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode((prev) => !prev);
    }, [setIsDarkMode]);

    return [isDarkMode, toggleDarkMode];
}

export default useDarkMode;
