import { useState, useCallback, useRef, useEffect } from 'react';
import type { Column } from '../types/DataTable.types';

interface UseTableResizeProps<T> {
  columns: Column<T>[];
  tableRef: React.RefObject<HTMLDivElement | null>;
  persistenceId?: string;
  resizable?: boolean;
}

export function useTableResize<T>({
  columns,
  tableRef,
  persistenceId,
  resizable = false,
}: UseTableResizeProps<T>) {
  // Parse initial width to numeric value
  const getInitialWidth = useCallback((col: Column<T>): number => {
    if (!col.width) return 150;
    const num = parseInt(col.width, 10);
    return isNaN(num) ? 150 : num;
  }, []);

  // Initialize state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (persistenceId) {
      try {
        const stored = localStorage.getItem(`dt-widths-${persistenceId}`);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.error('Failed to load table column widths', e);
      }
    }

    const initial: Record<string, number> = {};
    columns.forEach(col => {
      initial[col.key] = getInitialWidth(col);
    });
    return initial;
  });

  const columnWidthsRef = useRef(columnWidths);
  useEffect(() => {
    columnWidthsRef.current = columnWidths;
  }, [columnWidths]);

  // Keep state sync'd if column list changes
  useEffect(() => {
    setColumnWidths(prev => {
      const updated = { ...prev };
      let changed = false;
      columns.forEach(col => {
        if (updated[col.key] === undefined) {
          updated[col.key] = getInitialWidth(col);
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [columns, getInitialWidth]);

  const startResize = useCallback(
    (e: React.MouseEvent, columnKey: string) => {
      if (!resizable) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const initialWidth = columnWidthsRef.current[columnKey] || 150;
      const targetColumn = columns.find(col => col.key === columnKey);
      const minW = targetColumn?.minWidth ?? 50;
      const maxW = targetColumn?.maxWidth ?? 1000;

      const tableElement = tableRef.current;
      let finalWidth = initialWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const computedWidth = Math.max(minW, Math.min(maxW, initialWidth + deltaX));
        finalWidth = computedWidth;

        if (tableElement) {
          // Mutate the custom property on the table container directly for 60fps rendering
          tableElement.style.setProperty(`--col-width-${columnKey}`, `${computedWidth}px`);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Update React state at the end of the drag to trigger a single re-render and persist
        setColumnWidths(prev => {
          const next = { ...prev, [columnKey]: finalWidth };
          if (persistenceId) {
            try {
              localStorage.setItem(`dt-widths-${persistenceId}`, JSON.stringify(next));
            } catch (err) {
              console.error(err);
            }
          }
          return next;
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [resizable, columns, persistenceId, tableRef]
  );

  // Generate the custom CSS properties object to apply to the table container style
  const tableStyle = useCallback(() => {
    const style: Record<string, string> = {};
    Object.keys(columnWidths).forEach(key => {
      style[`--col-width-${key}`] = `${columnWidths[key]}px`;
    });
    return style;
  }, [columnWidths]);

  return {
    columnWidths,
    startResize,
    tableStyle,
  };
}
