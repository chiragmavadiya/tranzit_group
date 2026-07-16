import { StatusCell } from '@/components/common/DataTableCells';
import type { TraceStatus } from '../../types';

interface StatusBadgeProps {
  status: TraceStatus;
  statusConfig?: Record<string, string>
}

export const StatusBadge = ({ status, statusConfig }: StatusBadgeProps) => (
  <StatusCell value={status} statusConfig={statusConfig} />
);
