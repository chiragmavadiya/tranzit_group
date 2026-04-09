import { useState, useCallback } from 'react';
import type { PackagingData } from '../../types';

export const useOrderPackaging = (initialPackaging: PackagingData) => {
  const [packagingData, setPackagingData] = useState<PackagingData>(initialPackaging);

  const updatePackaging = useCallback((field: keyof PackagingData, value: string) => {
    setPackagingData((prev) => ({
      ...prev,
      [field]: field === 'tracking' ? value : (value === '' ? 0 : Number(value))
    }));
  }, []);

  return {
    packagingData,
    setPackagingData,
    updatePackaging,
  };
};
