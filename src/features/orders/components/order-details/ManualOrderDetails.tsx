import React from 'react';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';

interface ManualOrderData {
  trackingNumber: string;
  courierId: string;
  amount: string;
}

interface ManualOrderDetailsProps {
  manualOrderData: ManualOrderData;
  setManualOrderData: React.Dispatch<React.SetStateAction<ManualOrderData>>;
}

const globalCouriers = [
  { value: 2, label: 'Direct Freight Express TR' },
  { value: 1, label: 'Australia Post TR' },
]

export const ManualOrderDetails: React.FC<ManualOrderDetailsProps> = ({
  manualOrderData,
  setManualOrderData,
}) => {
  return (
    <div className="mb-4 p-5 bg-white dark:bg-zinc-950 rounded-md border border-gray-200 dark:border-zinc-800 shadow-xs transition-colors duration-300">
      <h3 className="mb-4 mt-0 text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wide">
        Manual Order Details
      </h3>
      <div className="flex flex-col md:flex-row gap-4">
        <FormInput
          label="Label Number (Tracking Number)"
          value={manualOrderData.trackingNumber}
          onChange={(val) => setManualOrderData((prev) => ({ ...prev, trackingNumber: val }))}
          placeholder="Enter tracking number"
          className="flex-1"
        />
        <FormSelect
          label="Courier"
          value={manualOrderData.courierId}
          onValueChange={(val) => setManualOrderData((prev) => ({ ...prev, courierId: val || '' }))}
          options={globalCouriers || []}
          placeholder="Select courier"
          className="flex-1"
        />
        <FormInput
          label="Amount"
          value={manualOrderData.amount}
          onChange={(val) => setManualOrderData((prev) => ({ ...prev, amount: val }))}
          placeholder="Enter amount"
          className="flex-1"
          type="number"
        />
      </div>
    </div>
  );
};
