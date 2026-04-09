import { useState, useCallback, useMemo } from 'react';
import type { ItemData } from '../../types';

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
        item: 'Item',
        sku: 'SKU',
        ship: 1,
        unitPrice: 0.00,
        weight: 2,
        size: '1',
        countryOfOrigin: 'China',
        qtyShipped: 1
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
