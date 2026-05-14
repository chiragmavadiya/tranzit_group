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
          className="global-btn"
        >
          <Plus className="w-4 h-4" />
          <span>Add MyItem</span>
        </Button>
      </div>
    </div>
  );
}
