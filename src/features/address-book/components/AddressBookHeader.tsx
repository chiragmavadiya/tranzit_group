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
          className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4 h-8"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-bold">Add Address</span>
        </Button>
      </div>
    </div>
  );
}
