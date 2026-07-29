import { useState, useCallback, useMemo } from 'react';
import { ItemsHeader } from './components/ItemsHeader';
import { CreateItemDialog } from './components/CreateItemDialog';
import type { Item, ItemFormData } from './types';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/types/DataTable.types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Star, Trash, Loader2, Info } from 'lucide-react';
import { ConformationModal } from '@/components/common/ConformationModal';

import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useExportItems,
  useSetDefaultItem,
  useUnsetDefaultItem,
  useToggleItemStatus,
} from './hooks/useItems';

import { useDebounce } from '@/hooks/useDebounce';
import { CustomTooltip } from '@/components/common/CustomTooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppSelector } from '@/hooks/store.hooks';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function MyItemsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [search, setSearch] = useLocalStorage<string>('items_search', '');
  const debouncedSearch = useDebounce(search, 500); // 500ms delay
  const [pageSize, setPageSize] = useLocalStorage<number>('items_page_size', 25);
  const [currentPage, setCurrentPage] = useLocalStorage<number>('items_current_page', 1);
  const { is_sub_user, team_access } = useAppSelector((state) => state.auth);
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.my_items === 'full', [is_sub_user, team_access]);

  const { data: itemsData, isLoading } = useItems({
    search: debouncedSearch,
    per_page: pageSize,
    page: currentPage
  });
  // const { data: editingItemData, isLoading: isItemLoading } = useItemDetails(editingItemId || undefined);

  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();
  const exportItemsMutation = useExportItems();
  const setDefaultItemMutation = useSetDefaultItem();
  const unsetDefaultItemMutation = useUnsetDefaultItem();
  const toggleItemStatusMutation = useToggleItemStatus();

  const handleSearch = useCallback((search: string) => {
    setSearch(search);
    setCurrentPage(1);
  }, [setSearch, setCurrentPage]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(1);
  }, [setPageSize, setCurrentPage]);

  const handleAddItem = useCallback(() => {
    setEditingItemId(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditItem = useCallback((item: Item) => {
    setEditingItemId(item.id);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id: number) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);


  const handleCloseModal = useCallback(() => {
    setIsDialogOpen(false);
    setEditingItemId(null);
  }, []);

  const handleFormSubmit = useCallback((data: ItemFormData) => {
    if (editingItemId) {
      updateItemMutation.mutate({ id: editingItemId, data }, {
        onSuccess: () => handleCloseModal()
      });
    } else {
      createItemMutation.mutate(data, {
        onSuccess: () => handleCloseModal()
      });
    }
  }, [editingItemId, createItemMutation, updateItemMutation, handleCloseModal]);

  const onSubmitDelete = useCallback(() => {
    if (itemToDelete) {
      deleteItemMutation.mutate(itemToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setItemToDelete(null);
        }
      });
    }
  }, [itemToDelete, deleteItemMutation]);

  const onCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  }, []);

  const handleExport = useCallback((format: 'pdf' | 'excel' | 'print' | 'csv') => {
    exportItemsMutation.mutate({ format, search });
  }, [exportItemsMutation, search]);


  // useEffect(() => {
  //   if (isSuccess && editingItemId) {
  //     setIsDialogOpen(true);
  //   }
  // }, [isSuccess, editingItemId])


  // const handleExport = useCallback(() => {
  //   toast.info('Exporting items to CSV...');
  //   // Implementation would go here
  // }, []);

  const columns = useMemo<Column<Item>[]>(() => [
    {
      key: "item_name",
      accessor: "item_name",
      header: "Item Name",
      sortable: true,
      searchable: true,
      cell: (val, row) => (
        <div className='flex items-center gap-3'>
          {canReadWrite && (
            <Tooltip>
              <TooltipTrigger
                render={<div />}
                className="block min-w-0 max-w-full cursor-pointer"
              >
                <button
                  onClick={() => {
                    if (!canReadWrite) return;
                    if (!row.is_default) {
                      setDefaultItemMutation.mutate(row.id);
                    } else {
                      unsetDefaultItemMutation.mutate(row.id);
                    }
                  }}
                  disabled={setDefaultItemMutation.isPending || unsetDefaultItemMutation.isPending}
                  className="mt-1.5 bg-transparent border-none outline-none focus:outline-none transition-transform active:scale-95 cursor-pointer hover:scale-110"
                >
                  {(setDefaultItemMutation.isPending && setDefaultItemMutation.variables === row.id) ||
                    (unsetDefaultItemMutation.isPending && unsetDefaultItemMutation.variables === row.id) ? (
                    <Loader2 className="h-4! w-4! animate-spin" />
                  ) : (
                    <Star className={`h-4 w-4 ${row.is_default ? 'fill-amber-400 text-amber-400' : 'text-primary-400'}`} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="flex flex-col gap-2.5 p-4 max-w-[280px] bg-slate-950 dark:bg-zinc-950 text-slate-100 dark:text-zinc-100 border border-slate-800 dark:border-zinc-800 rounded-xl shadow-xl select-none"
              >
                {!row.is_default ? (
                  <>
                    <div className="flex items-center gap-2 border-b border-slate-800/80 dark:border-zinc-800/80 pb-2">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                      <h4 className="m-0 text-[13px] font-bold tracking-tight text-white">Set as Fallback Item</h4>
                    </div>
                    <p className="m-0 text-xs font-semibold text-slate-200 leading-normal">
                      Used only when no default item is set for the order’s integration.
                    </p>
                    <p className="m-0 text-[12px] text-slate-300 dark:text-zinc-400 leading-relaxed">
                      This item will be used automatically when an order has no default item set for its integration. For example, if a Shopify order has no Shopify default item, this fallback item will be used.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 border-b border-slate-800/80 dark:border-zinc-800/80 pb-2">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                      <h4 className="m-0 text-[13px] font-bold tracking-tight text-white">Fallback Default Item</h4>
                    </div>
                    <p className="m-0 text-xs font-semibold text-slate-200 leading-normal">
                      This item is currently set as the fallback default item.
                    </p>
                    <p className="m-0 text-[12px] text-slate-300 dark:text-zinc-400 leading-relaxed">
                      This item will be used automatically when an order has no default item set for its integration. Click to unset this item.
                    </p>
                  </>
                )}
              </TooltipContent>
            </Tooltip>)}
          {/* </CustomTooltip> */}
          <div className='min-w-0'>
            <span className='text-[13px] xl:text-sm font-medium'>{val}</span>
            <p className='md:hidden m-0 text-[11px] text-gray-500 dark:text-zinc-400'>
              {row.item_code} · {row.item_length} × {row.item_width} × {row.item_height} cm · {typeof row.item_weight === 'number' ? row.item_weight.toFixed(2) : row.item_weight} kg
            </p>
          </div>
        </div>
      )
    },
    {
      key: "item_code",
      accessor: "item_code",
      header: "Item Code",
      sortable: true,
      searchable: true,
      className: "hidden md:table-cell",
    },
    {
      key: "dimensions",
      accessor: "dimensions",
      header: "Dimensions",
      className: "hidden md:table-cell",
      cell: (_, row) => `${row.item_length} × ${row.item_width} × ${row.item_height}`
    },
    {
      key: "item_weight",
      accessor: "item_weight",
      header: "Weight",
      className: "hidden md:table-cell",
      cell: (val) => typeof val === 'number' ? val.toFixed(2) + ' kg' : val
    },
    {
      key: "item_cubic",
      accessor: "item_cubic",
      header: "Item Cubic",
      sortable: true,
      className: "hidden lg:table-cell",
      cell: (val) => typeof val === 'number' ? val.toFixed(4) : val
    },
    {
      key: "status",
      accessor: "status",
      header: "Status",
      cell: (val, row) => {
        const isPending = toggleItemStatusMutation.isPending && toggleItemStatusMutation.variables === row.id;
        const isActive = val === 'Active';

        const handleToggle = () => {
          if (!canReadWrite) return;

          toggleItemStatusMutation.mutate(row.id);
        };

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              disabled={!canReadWrite || isPending || row.is_default}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-slate-950"
            />
            {isPending && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
          </div>
        );
      }
    },
    ...(canReadWrite ? [{
      key: "actions",
      header: "ACTIONS",
      className: "w-20 px-0 pr-3 print:hidden",
      cell: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <CustomTooltip title="Edit item">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary bg-transparent dark:hover:bg-transparent" onClick={() => handleEditItem(row)}>
              <Pencil className='h-4 w-4' />
            </Button>
          </CustomTooltip>

          <CustomTooltip title="Delete item">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-red-600 bg-transparent dark:hover:bg-transparent" onClick={() => handleDeleteClick(row.id)}>
              <Trash className='h-4 w-4' />
            </Button>
          </CustomTooltip>
        </div>
      )
    }] : [])
  ], [setDefaultItemMutation, unsetDefaultItemMutation, toggleItemStatusMutation, handleEditItem, handleDeleteClick, canReadWrite]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-y-auto">
      <div className='rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-none h-auto'>
        <DataTable
          columns={columns}
          data={itemsData?.data || []}
          loading={isLoading}
          searchPlaceholder="Search items..."
          onSearchChange={handleSearch}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          // pageSizeInFooter
          customHeader={canReadWrite ? <ItemsHeader onAddItem={handleAddItem} /> : null}
          headerTitle='My Items'
          headerDescription='Manage your shipping items, dimensions, and cubic measurements.'
          headerClass="h-20"
          className='pb-3 flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto'
          totalItems={itemsData?.meta?.total || 0}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onExport={(type) => handleExport(type)}
          isExporting={exportItemsMutation.isPending}
          exportable={canReadWrite}
        />
        {isDialogOpen && (
          <CreateItemDialog
            key={isDialogOpen ? `item-${editingItemId || 'new'}` : 'closed'}
            open={isDialogOpen}
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
            editingItemId={editingItemId}
            isLoading={createItemMutation.isPending || updateItemMutation.isPending}
          />
        )}

        <ConformationModal
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Item"
          description="Are you sure you want to delete this item?"
          onConfirm={onSubmitDelete}
          onCancel={onCancelDelete}
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="destructive"
          loading={deleteItemMutation.isPending}
          className="w-full"
        />
      </div>
    </div>
  );
}
