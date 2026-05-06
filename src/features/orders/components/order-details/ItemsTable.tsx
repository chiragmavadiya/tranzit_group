import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Plus, Trash2, Package, Scale, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SelectComponent from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ItemData } from '@/features/orders/types'
import { useItems } from '@/features/items/hooks/useItems'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
  const { orderType } = useParams<{ orderType?: string }>()
  const isReadOnly = orderType !== 'create'

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
  return (
    <Accordion multiple defaultValue={['notes', 'services', 'summary', 'pickup_date']} className="flex flex-col gap-3">

      {/* ORDER QUOTATION SUMMARY */}
      <AccordionItem value="summary" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0">
        <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-[#0060FE] dark:[&>svg]:text-blue-500 items-center">
          <div className="flex items-center w-full justify-between ">
            <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-300">
              <Box className="w-5 h-5" />
              <h3 className="my-0 text-base font-semibold text-gray-800 dark:text-zinc-100">Items {items.length > 0 && ` (${items.length})`}</h3>
            </div>
            {!isReadOnly && (
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  addItem?.({
                    type: 'box',
                    quantity: 1,
                    weight: 0,
                    length: 0,
                    width: 0,
                    height: 0,
                  })
                }}
                className="hidden group-aria-expanded/accordion-trigger:flex  bg-[#0A1B39] hover:bg-[#0A1B39]/90 text-white text-xs font-medium py-2 px-4 rounded-md items-center gap-2 h-8 mr-4"
              >
                <Plus className="h-4 w-4" />
                Add item
              </Button>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2 pb-4 pt-4">

          <div className="w-full flex flex-col gap-4">
            {/* <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
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
            </div> */}

            <div className="flex flex-col gap-4">
              {isEmpty || (!items?.length && !children) ? (
                <div className="py-8 flex items-center justify-center text-sm text-gray-500 font-medium">
                  No items available.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items?.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {isReadOnly ? (
                        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 p-4 rounded-xl bg-gray-50/50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all duration-200">
                          {/* Item Type */}
                          <div className="flex items-center gap-3 min-w-[140px]">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</div>
                              <div className="text-xs font-bold text-gray-900 dark:text-zinc-100">
                                {item.type === 'my_item' ? (
                                  predefinedItems.find(i => i.id.toString() === item.item_id?.toString())?.item_name || 'My Item'
                                ) : 'Standard Parcel'}
                              </div>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-3 min-w-[100px]">
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                              <Box className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qty</div>
                              <div className="text-xs font-bold text-gray-900 dark:text-zinc-100">{item.quantity} Units</div>
                            </div>
                          </div>

                          {/* Weight */}
                          <div className="flex items-center gap-3 min-w-[100px]">
                            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                              <Scale className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weight</div>
                              <div className="text-xs font-bold text-gray-900 dark:text-zinc-100">{item.weight} kg</div>
                            </div>
                          </div>

                          {/* Dimensions */}
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                              <Ruler className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dimensions (L×W×H)</div>
                              <div className="text-xs font-bold text-gray-900 dark:text-zinc-100">
                                {item.length} × {item.width} × {item.height} cm
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`flex items-end gap-3 pb-4 ${idx !== items.length - 1 ? 'border-b border-gray-100 dark:border-zinc-800' : ''}`}>
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
                      )}
                    </React.Fragment>
                  ))}
                  {children}
                </div>
              )}
            </div>

            {footer && <div className="mt-2">{footer}</div>}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
