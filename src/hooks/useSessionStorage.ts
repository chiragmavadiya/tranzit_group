import { useState } from 'react';

const useSessionStorage = <T>(
    key: string,
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const getStoredValue = (): T => {
        try {
            const item = sessionStorage.getItem(key);
            return item !== null && item !== 'undefined' && item !== '{}' ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
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

            sessionStorage.setItem(
                key,
                JSON.stringify(valueToStore)
            );
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export default useSessionStorage;