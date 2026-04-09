import React, { useCallback, useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { ChevronDown, Settings, Image as ImageIcon, MoreVertical, Pencil } from 'lucide-react'
import Dropdown, { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ColumnSettings } from '../../components/ColumnSettings'
import type { ItemData, ItemsColumn } from '../../types'
import { ITEMS_COLUMNS } from '../constants'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import SelectComponent from '@/components/ui/select'
import { EditItemDialog } from './EditItemDialog'

interface ItemsTableProps {
  items: ItemData[]
  onUpdateItem?: (index: number, key: string, value: string | number) => void
  children?: React.ReactNode
  footer?: React.ReactNode
  footerCells?: React.ReactNode[]
  isEmpty?: boolean
  addItem?: (data?: ItemData) => void
  removeItem?: (index: number | undefined) => void
  onFullUpdateItem?: (index: number, data: ItemData) => void
}

// Moved to constants.ts


export const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  onUpdateItem,
  children,
  footer,
  footerCells,
  addItem,
  removeItem,
  onFullUpdateItem,
  isEmpty = false,
}) => {
  const [currency, setCurrency] = useState('AUD');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<{ index: number; data: ItemData } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    useMemo(() => ITEMS_COLUMNS.filter(c => c.default).length > 0
      ? ITEMS_COLUMNS.filter(c => c.default).map(c => c.key)
      : ITEMS_COLUMNS.map(col => col.key), [])
  );

  const filteredColumns = useMemo(() => ITEMS_COLUMNS.filter(col => visibleColumns.includes(col.key)), [visibleColumns]);

  const toggleColumn = useCallback((key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  }, []);

  const handleEditClick = useCallback(() => {
    setIsEditable((prev) => !prev);
  }, [])

  const handleOpenEditDialog = useCallback((index: number, data: ItemData) => {
    setEditingItem({ index, data });
  }, []);

  const handleSaveItem = useCallback((updatedData: ItemData) => {
    if (editingItem && onFullUpdateItem) {
      onFullUpdateItem(editingItem.index, updatedData);
    }
    setEditingItem(null);
  }, [editingItem, onFullUpdateItem]);

  const handleAddAnother = useCallback((data: ItemData) => {
    if (onFullUpdateItem && editingItem) {
      onFullUpdateItem(editingItem.index, data);
    }
    addItem?.(data);
  }, [addItem, onFullUpdateItem, editingItem]);

  return (
    <Card className="border-1 ring-0 shadow-md border-gray-200 dark:border-zinc-800 rounded-xl py-1 px-4 overflow-hidden group transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group-hover:bg-gray-50/50 dark:group-hover:bg-zinc-800/50 transition-colors">
        <CardTitle className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">
          ITEMS
        </CardTitle>
        <ChevronDown onClick={handleEditClick} className={`h-5 w-5 text-[#0060FE] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-full transition-colors transition-transform duration-300 ${isEditable ? 'rotate-180' : ''}`} />
      </CardHeader>
      <CardContent className="p-0 bg-white dark:bg-zinc-950">
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className="bg-white dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 has-aria-expanded:bg-white transition-colors">
                {filteredColumns.map((header: ItemsColumn) => (
                  <TableHead key={header.key} className="h-12 text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5">
                    {header.label}
                  </TableHead>
                ))}
                {isEditable && (
                  <TableHead key="settings" className="h-12 w-10 text-[10px] sticky right-0 font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wider px-5 border-gray-200 dark:border-zinc-800 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)] bg-inherit">
                    <Dropdown
                      content={<ColumnSettings
                        columns={ITEMS_COLUMNS.map(c => ({ key: c.key, header: c.label, default: c.default }))}
                        visibleColumns={visibleColumns}
                        onToggleColumn={toggleColumn}
                        onSetVisibleColumns={setVisibleColumns}
                      />}
                    >
                      <Settings className='h-5 w-5 text-[#0060FE]' />
                    </Dropdown>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isEmpty || (!items?.length && !children) ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={filteredColumns.length + 1} className="h-24 text-center text-sm text-gray-500 dark:text-zinc-400 font-medium">
                    No records available.
                  </TableCell>
                </TableRow>
              ) : items && items.length > 0 ? (
                items.map((item, idx) => (
                  <TableRow key={idx} className="group/row bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 transition-colors">
                    {filteredColumns.map((col: ItemsColumn) => (
                      <TableCell key={col.key} className={`px-5 ${isEditable ? 'py-4' : 'py-2'} text-xs font-medium text-gray-700 dark:text-zinc-300 whitespace-nowrap`}>
                        <div className="flex items-center gap-3">
                          {col.key === 'item' && (
                            <div className="w-6 h-6 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center border border-gray-200 dark:border-zinc-700 shrink-0">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          {isEditable && col.editable ? (
                            <>
                              <Input
                                value={item[col.key] || ''}
                                onChange={(e) => onUpdateItem?.(idx, col.key, col.type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
                                className={`h-7 w-full min-w-[50px] ${col.key === 'ship' || col.key === 'qtyShipped' ? 'w-[60px]' : ''} text-xs border-transparent bg-transparent shadow-none group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-blue-600 transition-all font-medium py-0 px-2`}
                                type={col.type === 'number' ? 'number' : 'text'}
                              />
                              {col.key === 'ship' || col.key === 'qtyShipped' && (
                                <span className="text-xs text-gray-500 dark:text-zinc-400">of 1</span>
                              )}
                            </>
                          ) : (
                            <span className={col.key === 'item' ? 'font-bold' : ''}>
                              {/* if col key id ship then display value of ship as 0 of 0 */}
                              {col.key === 'ship' || col.key === 'qtyShipped' ? `${item[col.key] || 0} of 1` : item[col.key] as string || '-'}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    ))}
                    {isEditable && (
                      <TableCell className="w-10 px-2 text-center sticky right-0 transition-colors z-0 border-l border-gray-200 dark:border-zinc-800 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)] bg-inherit">
                        <div className="flex items-center gap-1">
                          <Pencil
                            className='h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer'
                            onClick={() => handleOpenEditDialog(idx, item)}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer px-[5px] py-[5px] hover:bg-gray-200 rounded dark:hover:bg-zinc-800  text-gray-700 dark:text-zinc-300 transition-colors outline-none">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                              <DropdownMenuItem onClick={() => removeItem?.(idx)} className="cursor-pointer text-red-400 focus:text-red-400 hover:bg-red-400/10">
                                Remove
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => addItem?.(item)} className="cursor-pointer">
                                Clone
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    )}

                  </TableRow>
                ))
              ) : (
                children
              )}
            </TableBody>
            <TableFooter className="bg-white dark:bg-zinc-950">
              <TableRow className="hover:bg-transparent border-t border-gray-400 dark:border-zinc-800">
                {filteredColumns.map((col: ItemsColumn) => (
                  <TableCell key={col.key} className="px-5 py-3 text-[12px] font-bold text-gray-900 dark:text-zinc-100 whitespace-nowrap">

                    {col.key === 'ship' || col.key === 'qtyShipped' ? items.reduce((acc, item) => acc + (item[col.key] as number), 0) + ' of ' + items?.length :
                      col.displayTotal ? items.reduce((acc, item) => acc + (item[col.key] as number), 0) : ''}
                  </TableCell>
                ))}
                <TableCell className="sticky right-0 bg-inherit"></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        {isEditable && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <Button
              onClick={() => addItem?.()}
              className="bg-[#0060FE] hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-all duration-200 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              ADD ITEM
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 capitalize">Currency</span>
              <SelectComponent
                data={[
                  { key: 'AUD', value: 'aud' },
                  { key: 'USD', value: 'usd' },
                  { key: 'EUR', value: 'eur' },
                  { key: 'GBP', value: 'gbp' }
                ]}
                value={currency}
                onValueChange={(val) => val && setCurrency(val)}
                className="w-24 h-9 text-xs font-bold"
                placeholder="AUD"
              />
            </div>
          </div>
        )}

        {footer && <div className="border-t border-gray-100 dark:border-zinc-800 px-5 py-3 bg-white dark:bg-zinc-950 transition-colors">{footer}</div>}
      </CardContent>

      <EditItemDialog
        open={editingItem !== null}
        onOpenChange={(open) => !open && setEditingItem(null)}
        item={editingItem?.data || null}
        onSave={handleSaveItem}
        onAddAnother={handleAddAnother}
      />
    </Card >
  )
}
