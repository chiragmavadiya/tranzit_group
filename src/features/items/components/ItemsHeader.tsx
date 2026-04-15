import { Plus, Download, FileText, Upload, File, ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownCustomMenu } from '@/components/ui/dropdown-menu';

interface ItemsHeaderProps {
  onAddItem: () => void;
}

export function ItemsHeader({ onAddItem }: ItemsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className='absolute top-0 left-0'>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">My Items</h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-1">
          Manage your inventory items, shipping dimensions, and availability status.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <DropdownCustomMenu
          menus={[
            {
              label: "Print",
              onClick: () => { },
              icon: Download,
            },
            {
              label: "CSV",
              onClick: () => { },
              icon: File,
            },
            {
              label: "Excel",
              onClick: () => { },
              icon: Upload,
            },
            {
              label: "PDF",
              onClick: () => { },
              icon: FileText,
            },
            {
              label: "Copy",
              onClick: () => { },
              icon: ClipboardCopy,
            },
          ]}
        >
          <Button
            variant="outline"
            className="gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </DropdownCustomMenu>
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
