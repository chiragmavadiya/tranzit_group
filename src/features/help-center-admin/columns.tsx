import type { Column } from '@/components/common';
import type { HelpArticle } from './types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export const ARTICLE_COLUMNS = (
  onEdit: (row: HelpArticle) => void,
  onDelete: (row: HelpArticle) => void
): Column<HelpArticle>[] => [
    {
      key: 'id',
      header: '#',
      cell: (_, __, index) => <span className="text-slate-400 font-medium">{index + 1}</span>,
    },
    {
      key: 'title',
      header: 'TITLE',
      sortable: true,
      cell: (val, row) => (
        <div className="flex flex-col py-1">
          <span className="font-bold text-slate-800 dark:text-zinc-100 text-[13px]">{val as string}</span>
          <span className="text-[10px] text-slate-400 font-medium">{row.slug}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'CATEGORY',
      sortable: true,
      cell: (val) => <span className="font-medium text-slate-600 dark:text-zinc-400">{val as string}</span>,
    },
    {
      key: 'status',
      header: 'STATUS',
      sortable: true,
      cell: (val) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
        if (val === 'Published') variant = "default";
        if (val === 'Archived') variant = "destructive";

        return (
          <Badge variant={variant} className="font-bold text-[10px] uppercase tracking-wider h-5 px-2">
            {val as string}
          </Badge>
        );
      },
    },
    {
      key: 'updatedAt',
      header: 'UPDATED',
      sortable: true,
      cell: (val) => (
        <span className="text-slate-500 dark:text-zinc-500 font-medium">
          {format(new Date(val as string), "dd MMM yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTION',
      sticky: 'right',
      cell: (_, row) => (
        <div className="flex items-center gap-2 pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-90"
            onClick={() => onEdit(row)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
            onClick={() => onDelete(row)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];
