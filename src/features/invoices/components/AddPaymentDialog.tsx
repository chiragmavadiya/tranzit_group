import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminInvoicePayment } from '../hooks/useInvoices';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';

interface AddPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | number;
}

export function AddPaymentDialog({ isOpen, onOpenChange, invoiceId }: AddPaymentDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    payment_amount: '',
    payment_method: 'Bank Transfer',
    payment_date: new Date().toISOString().split('T')[0],
    internal_payment_note: ''
  });

  const { add } = useAdminInvoicePayment();

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    add.mutate({
      id: invoiceId,
      data: formData
    }, {
      onSuccess: () => {
        // Invalidate the invoice details query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ['admin', 'invoices', 'details', invoiceId.toString()] });

        onOpenChange(false);
        setFormData({
          payment_amount: '',
          payment_method: 'Bank Transfer',
          payment_date: new Date().toISOString().split('T')[0],
          internal_payment_note: ''
        });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <CustomModel
      title='Add Payment'
      open={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      onCancel={() => onOpenChange(false)}
      isLoading={!!add.isPending}
      submitText='Add Payment'
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <FormInput
              label="Amount"
              type="number"
              step="0.01"
              value={formData.payment_amount}
              onChange={(val) => handleChange('payment_amount', val)}
              placeholder="Enter amount (e.g. 123.45)"
              required
            />
          </div>
          <div className="grid gap-2">
            <FormSelect
              label="Payment Method"
              value={formData.payment_method}
              options={[
                { label: 'Bank Transfer', value: 'Bank Transfer' },
                { label: 'Credit Card', value: 'Credit Card' },
                { label: 'Cash', value: 'Cash' },
                { label: 'Cheque', value: 'Cheque' }
              ]}
              onValueChange={(val) => handleChange('payment_method', val!)}
              placeholder="Select payment method"
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              label="Payment Date"
              type="date"
              value={formData.payment_date}
              onChange={(val) => handleChange('payment_date', val || '')}
              placeholder="Select payment date"
              required
            />
          </div>
          <div className="grid gap-2">
            <FormInput
              label="Note"
              value={formData.internal_payment_note}
              onChange={(val) => handleChange('internal_payment_note', val || '')}
              placeholder="Payment reference, tx ID, etc."
            />
          </div>
        </div>
      </form>
    </CustomModel>
  );
}
