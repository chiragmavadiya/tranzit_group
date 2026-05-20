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
  globalCouriers: Array<{ label: string; value: string }> | undefined;
}

export const ManualOrderDetails: React.FC<ManualOrderDetailsProps> = ({
  manualOrderData,
  setManualOrderData,
  globalCouriers,
}) => {
  return (
    <div className="mb-4 p-5 bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
      <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider">
        Manual Order Details
      </h3>
      <div className="flex flex-col md:flex-row gap-4">
        <FormInput
          label="Label Number (Tracking Number)"
          value={manualOrderData.trackingNumber}
          onChange={(val) => setManualOrderData((prev) => ({ ...prev, trackingNumber: val }))}
          placeholder="Enter tracking number"
          className="flex-1 h-8"
        />
        <FormSelect
          label="Courier"
          value={manualOrderData.courierId}
          onValueChange={(val) => setManualOrderData((prev) => ({ ...prev, courierId: val || '' }))}
          options={globalCouriers || []}
          placeholder="Select courier"
          className="flex-1 h-8"
        />
        <FormInput
          label="Amount"
          value={manualOrderData.amount}
          onChange={(val) => setManualOrderData((prev) => ({ ...prev, amount: val }))}
          placeholder="Enter amount"
          className="flex-1 h-8"
          type="number"
        />
      </div>
    </div>
  );
};
