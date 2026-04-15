import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Status Badge Cell Renderer
interface StatusCellProps {
  value: string;
  statusConfig?: Record<string, { className: string; label?: string }>;
}

export const StatusCell: React.FC<StatusCellProps> = ({ value, statusConfig }) => {
  const defaultStatusConfig: Record<string, { className: string; label?: string }> = {
    active: { className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
    inactive: { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
    pending: { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
    completed: { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    cancelled: { className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
    draft: { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
  };

  const config = statusConfig || defaultStatusConfig;
  const statusKey = value?.toLowerCase();
  const statusStyle = config[statusKey] || config.draft;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "px-2 py-1 text-xs font-medium border-none",
        statusStyle.className
      )}
    >
      {statusStyle.label || value}
    </Badge>
  );
};

// Link Cell Renderer
interface LinkCellProps {
  value: any;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
}

export const LinkCell: React.FC<LinkCellProps> = ({
  value,
  href,
  onClick,
  external = false,
  className
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const content = (
    <span className={cn(
      "text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium inline-flex items-center gap-1",
      className
    )}>
      {String(value)}
      {external && <ExternalLink className="w-3 h-3" />}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return <span onClick={handleClick}>{content}</span>;
};

// Actions Cell Renderer
interface Action<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
  disabled?: (row: T) => boolean;
}

interface ActionsCellProps<T> {
  row: T;
  actions: Action<T>[];
}

export function ActionsCell<T>({ row, actions }: ActionsCellProps<T>) {
  if (actions.length === 1) {
    const action = actions[0];
    const Icon = action.icon;

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => action.onClick(row)}
        disabled={action.disabled?.(row)}
        className={cn(
          "h-8 px-2",
          action.variant === 'destructive' && "text-red-600 hover:text-red-700 hover:bg-red-50"
        )}
      >
        {Icon && <Icon className="w-4 h-4 mr-1" />}
        {action.label}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(row)}
              disabled={action.disabled?.(row)}
              className={cn(
                action.variant === 'destructive' && "text-red-600 focus:text-red-700"
              )}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Date Cell Renderer
interface DateCellProps {
  value: string | Date;
  format?: 'short' | 'long' | 'relative';
  className?: string;
}

export const DateCell: React.FC<DateCellProps> = ({
  value,
  format = 'short',
  className
}) => {
  if (!value) return <span className={className}>-</span>;

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return <span className={className}>Invalid Date</span>;
  }

  let formattedDate: string;

  switch (format) {
    case 'long':
      formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      break;
    case 'relative':
      {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
          formattedDate = 'Today';
        } else if (diffInDays === 1) {
          formattedDate = 'Yesterday';
        } else if (diffInDays < 7) {
          formattedDate = `${diffInDays} days ago`;
        } else {
          formattedDate = date.toLocaleDateString();
        }
        break;
      }
    default:
      formattedDate = date.toLocaleDateString();
  }

  return (
    <span className={cn("text-sm", className)} title={date.toLocaleString()}>
      {formattedDate}
    </span>
  );
};

// Currency Cell Renderer
interface CurrencyCellProps {
  value: number;
  currency?: string;
  locale?: string;
  className?: string;
}

export const CurrencyCell: React.FC<CurrencyCellProps> = ({
  value,
  currency = 'USD',
  locale = 'en-US',
  className
}) => {
  if (typeof value !== 'number') {
    return <span className={className}>-</span>;
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

  return (
    <span className={cn("font-medium", className)}>
      {formatted}
    </span>
  );
};

// Avatar Cell Renderer
interface AvatarCellProps {
  name: string;
  image?: string;
  email?: string;
  className?: string;
}

export const AvatarCell: React.FC<AvatarCellProps> = ({
  name,
  image,
  email,
  className
}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {initials}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        {email && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{email}</span>
        )}
      </div>
    </div>
  );
};

// Utility function to create common action sets
// eslint-disable-next-line react-refresh/only-export-components
export const createCommonActions = <T,>(
  onView?: (row: T) => void,
  onEdit?: (row: T) => void,
  onDelete?: (row: T) => void
): Action<T>[] => {
  const actions: Action<T>[] = [];

  if (onView) {
    actions.push({
      label: 'View',
      icon: Eye,
      onClick: onView,
    });
  }

  if (onEdit) {
    actions.push({
      label: 'Edit',
      icon: Edit,
      onClick: onEdit,
    });
  }

  if (onDelete) {
    actions.push({
      label: 'Delete',
      icon: Trash,
      onClick: onDelete,
      variant: 'destructive',
    });
  }

  return actions;
};