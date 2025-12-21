'use client';

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from localStorage after mount (client-side only)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
        }
        setIsInitialized(true);
    }, [key]);

    // Persist to localStorage whenever value changes
    useEffect(() => {
        if (!isInitialized || typeof window === 'undefined') return;

        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue, isInitialized]);

    // Return a wrapped version of useState's setter function that persists the new value
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        setStoredValue((prevValue) => {
            const valueToStore = value instanceof Function ? value(prevValue) : value;
            return valueToStore;
        });
    }, []);

    // Clear the value
    const clearValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, clearValue];
}

export default useLocalStorage;
