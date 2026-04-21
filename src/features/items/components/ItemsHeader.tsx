import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemsHeaderProps {
  onAddItem: () => void;
}

export function ItemsHeader({ onAddItem }: ItemsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={onAddItem}
          className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add MyItem</span>
        </Button>
      </div>
    </div>
  );
}
