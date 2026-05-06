import React, { useMemo } from 'react'
import { Box, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SelectComponent from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ItemData } from '@/features/orders/types'
import { useItems } from '@/features/items/hooks/useItems'

interface ItemsTableProps {
  items: ItemData[]
  onUpdateItem?: (index: number, key: string, value: string | number) => void
  children?: React.ReactNode
  footer?: React.ReactNode
  isEmpty?: boolean
  addItem?: (data?: ItemData) => void
  removeItem?: (index: number | undefined) => void
  onFullUpdateItem?: (index: number, data: ItemData) => void
}

export const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  onUpdateItem,
  children,
  footer,
  addItem,
  removeItem,
  onFullUpdateItem,
  isEmpty = false,
}) => {
  const { data: itemsResponse } = useItems({ per_page: 100 })
  const predefinedItems = useMemo(() => itemsResponse?.data || [], [itemsResponse])

  const predefinedItemsOptions = useMemo(() => {
    return predefinedItems.map(item => ({
      label: item.item_name,
      value: item.id.toString(),
    }))
  }, [predefinedItems])

  const handlePredefinedItemSelect = (index: number, itemIdStr: string) => {
    if (!onFullUpdateItem) return;

    const selectedItem = predefinedItems.find(item => item.id.toString() === itemIdStr)
    if (selectedItem) {
      const currentData = items[index];
      onFullUpdateItem(index, {
        ...currentData,
        item_id: selectedItem.id,
        item_name: selectedItem.item_name,
        weight: 50,
        length: 50,
        width: 50,
        height: 50,
      })
    }
  }
  console.log(items)
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-300">
          <Box className="w-5 h-5" />
          <h3 className="text-base font-semibold text-gray-800 dark:text-zinc-100">Items</h3>
        </div>
        <Button
          onClick={() => addItem?.({
            type: 'box',
            quantity: 1,
            weight: 0,
            length: 0,
            width: 0,
            height: 0,
          })}
          className="bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white text-xs font-medium py-2 px-4 rounded-md flex items-center gap-2 h-8"
        >
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {isEmpty || (!items?.length && !children) ? (
          <div className="py-8 flex items-center justify-center text-sm text-gray-500 font-medium">
            No items available.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items?.map((item, idx) => (
              <div key={idx} className={`flex items-end gap-3 pb-4 ${idx !== items.length - 1 ? 'border-b border-gray-100 dark:border-zinc-800' : ''}`}>

                {/* Type Selection */}
                <div className="flex flex-col gap-1 w-[180px] shrink-0">
                  <Label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">Type</Label>
                  <SelectComponent
                    value={item.type || 'box'}
                    onValueChange={(val) => onUpdateItem?.(idx, 'type', val!)}
                    data={[
                      { label: 'Parcel', value: 'box' },
                      { label: 'My Items', value: 'my_item' }
                    ]}
                    placeholder="Select Type"
                    className="h-8 text-sm font-medium"
                  />
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1 w-[80px] shrink-0">
                  <Label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => onUpdateItem?.(idx, 'quantity', Number(e.target.value) || 0)}
                    className="h-8 text-sm font-medium"
                    min="1"
                  />
                </div>

                {/* Conditional Fields based on Type */}
                {item.type === 'my_item' ? (
                  <div className="flex flex-col gap-1 flex-1">
                    <Label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">Select Item</Label>
                    <SelectComponent
                      value={item.item_id?.toString() || ''}
                      onValueChange={(val) => handlePredefinedItemSelect(idx, val!)}
                      data={predefinedItemsOptions}
                      placeholder="Select a predefined item"
                      className="h-8 text-sm font-medium"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1 flex-1">
                      <Label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">Weight (kg)</Label>
                      <Input
                        type="number"
                        value={item.weight || ''}
                        onChange={(e) => onUpdateItem?.(idx, 'weight', Number(e.target.value) || 0)}
                        className="h-8 text-sm font-medium"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <Label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">Length (cm)</Label>
                      <Input
                        type="number"
                        value={item.length || ''}
                        onChange={(e) => onUpdateItem?.(idx, 'length', Number(e.target.value) || 0)}
                        className="h-8 text-sm font-medium"
                        min="0"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <Label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">Width (cm)</Label>
                      <Input
                        type="number"
                        value={item.width || ''}
                        onChange={(e) => onUpdateItem?.(idx, 'width', Number(e.target.value) || 0)}
                        className="h-8 text-sm font-medium"
                        min="0"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <Label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">Height (cm)</Label>
                      <Input
                        type="number"
                        value={item.height || ''}
                        onChange={(e) => onUpdateItem?.(idx, 'height', Number(e.target.value) || 0)}
                        className="h-8 text-sm font-medium"
                        min="0"
                      />
                    </div>
                  </>
                )}

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-10 shrink-0 bg-red-50 hover:bg-red-100 text-red-500 dark:bg-red-950/30 dark:hover:bg-red-900/50 rounded-md"
                  onClick={() => removeItem?.(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {children}
          </div>
        )}
      </div>

      {footer && <div className="mt-2">{footer}</div>}
    </div>
  )
}
