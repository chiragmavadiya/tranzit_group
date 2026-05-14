import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface AddressBookHeaderProps {
  onAddAddress: () => void;
}

export function AddressBookHeader({ onAddAddress }: AddressBookHeaderProps) {

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={onAddAddress}
          className="global-btn"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-bold">Add Address</span>
        </Button>
      </div>
    </div>
  );
}
