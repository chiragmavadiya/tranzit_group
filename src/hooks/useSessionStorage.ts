import { useState } from 'react';

const useLocalStorage = <T>(
    key: string,
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const getStoredValue = (): T => {
        try {
            const item = localStorage.getItem(key);

            return item
                ? JSON.parse(item)
                : initialValue;
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

            localStorage.setItem(
                key,
                JSON.stringify(valueToStore)
            );
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;