import { useState, useCallback, useMemo } from 'react';
import type { ItemData } from '../types';

export const useOrderItems = (initialItems: ItemData[] = []) => {
  const [itemsData, setItemsData] = useState<ItemData[]>(initialItems);

  const updateItem = useCallback((index: number, field: string, value: string | number) => {
    setItemsData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  }, []);

  const fullUpdateItem = useCallback((index: number, data: ItemData) => {
    setItemsData((prev) => {
      const newData = [...prev];
      newData[index] = data;
      return newData;
    });
  }, []);

  const addItem = useCallback((data?: ItemData) => {
    setItemsData((prev) => [
      ...prev,
      data || {
        type: "box",
        quantity: 0,
        weight: 0,
        length: 0,
        width: 0,
        height: 0
      }
    ]);
  }, []);

  const removeItem = useCallback((index: number | undefined) => {
    if (index === undefined) return;
    setItemsData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const itemsTotal = useMemo(() => {
    // This could be used for footer or other calculations
    return itemsData.length;
  }, [itemsData]);

  return {
    itemsData,
    setItemsData,
    updateItem,
    fullUpdateItem,
    addItem,
    removeItem,
    itemsTotal
  };
};
