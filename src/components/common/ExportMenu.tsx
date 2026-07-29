import { File, FileText, Loader2, Printer, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { DropdownCustomMenu } from '../ui/dropdown-menu';

export type ExportFormat = 'csv' | 'excel' | 'pdf';

interface ExportMenuProps {
  onExport?: (format: ExportFormat) => void;
  isExporting?: boolean;
  print?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ExportMenu({
  onExport,
  isExporting = false,
  print = true,
  disabled = false,
  className,
}: ExportMenuProps) {
  return (
    <DropdownCustomMenu
      menus={[
        ...(print ? [{
          label: 'Print',
          onClick: () => window.print(),
          icon: Printer,
        }] : []),
        {
          label: 'CSV',
          onClick: () => onExport?.('csv'),
          icon: File,
        },
        {
          label: 'Excel',
          onClick: () => onExport?.('excel'),
          icon: Upload,
        },
        {
          label: 'PDF',
          onClick: () => onExport?.('pdf'),
          icon: FileText,
        },
      ]}
    >
      <Button
        variant="outline"
        className={cn(
          "h-8 gap-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium text-slate-700 dark:text-zinc-300 transition-colors shrink-0",
          className
        )}
        disabled={disabled || isExporting}
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <span>Export</span>
      </Button>
    </DropdownCustomMenu>
  );
}
