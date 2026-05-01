import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  selectable?: boolean;
}

export function TableSkeleton({ columns, rows = 10, selectable = false }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-transparent">
          {selectable && (
            <TableCell className="px-5 py-4">
              <Skeleton className="h-4 w-4 rounded" />
            </TableCell>
          )}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className="px-5 py-4">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
