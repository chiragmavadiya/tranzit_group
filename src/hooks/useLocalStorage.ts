import { useState } from 'react';

const useLocalStorage = <T>(
    key: string,
    initialValue: T,
    // Lets callers re-derive a stored value that goes stale over time (e.g. relative date filters).
    hydrate?: (storedValue: T, initialValue: T) => T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const getStoredValue = (): T => {
        // An empty key means the caller opted out of persistence, so behave like useState.
        if (!key) return initialValue;
        try {
            const item = localStorage.getItem(key);
            if (item === null || item === 'undefined' || item === '{}') return initialValue;
            const storedValue = JSON.parse(item) as T;
            return hydrate ? hydrate(storedValue, initialValue) : storedValue;
        } catch (error) {
            console.error("error", error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] =
        useState<T>(getStoredValue);

    const setValue: React.Dispatch<
        React.SetStateAction<T>
    > = (value) => {
        try {
            const valueToStore =
                value instanceof Function
                    ? value(storedValue)
                    : value;

            setStoredValue(valueToStore);

            if (key) {
                localStorage.setItem(
                    key,
                    JSON.stringify(valueToStore)
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;