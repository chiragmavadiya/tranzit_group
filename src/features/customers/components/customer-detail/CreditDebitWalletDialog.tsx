import { useState } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { useCreateCustomerTransaction } from '../../hooks/useCustomers';
import { showToast } from '@/components/ui/custom-toast';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';

interface CreditDebitWalletDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string | number;
}

export function CreditDebitWalletDialog({ isOpen, onOpenChange, customerId }: CreditDebitWalletDialogProps) {
  const [formData, setFormData] = useState({
    amount: '',
    transaction_type: '',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending } = useCreateCustomerTransaction();

  const handleSubmit = () => {
    setSubmitted(true)
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      showToast('Please enter a valid amount greater than 0', 'error');
      return;
    }

    if (!formData.transaction_type) {
      showToast('Please select a transaction type', 'error');
      return;
    }

    mutate({
      id: customerId,
      data: {
        amount: parseFloat(formData.amount),
        transaction_type: formData.transaction_type,
        description: formData.description,
      }
    }, {
      onSuccess: () => {
        showToast('Transaction created successfully', 'success');
        onOpenChange(false);
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || 'Failed to create transaction', 'error');
      }
    });
  };

  return (
    <CustomModel
      title='Credit/Debit Wallet'
      open={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isPending}
    >
      {/* Enter Amount */}
      <div className='space-y-4'>
        <div className="space-y-1.5">
          <FormInput
            label="Amount"
            value={formData.amount}
            onChange={(val) => setFormData({
              ...formData,
              amount: val,
            })}
            placeholder="Enter amount"
            type="number"
            step="0.01"
            required
            error={submitted && (!formData.amount || parseFloat(formData.amount) <= 0)}
            errormsg='Please enter amount'
          />
        </div>

        {/* Transaction Type */}
        <div className="space-y-1.5">
          <FormSelect
            options={[
              { label: 'Credit', value: '1' },
              { label: 'Debit', value: '2' }
            ]}
            label='Transaction Type'
            value={formData.transaction_type}
            onValueChange={(val) => setFormData({
              ...formData,
              transaction_type: val || '',
            })}
            placeholder="Select type"
            error={submitted && !formData.transaction_type}
            errormsg='Please select transaction type'
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <FormTextarea
            label="Description"
            value={formData.description}
            onChange={(val) => setFormData({
              ...formData,
              description: val || '',
            })}
            placeholder="Enter reason or description..."
            rows={3}
            error={submitted && !formData.description}
            errormsg='Please enter description'
          />
        </div>
      </div>
    </CustomModel>
  );
}
