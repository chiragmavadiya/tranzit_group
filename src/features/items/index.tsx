import { useState, useCallback, useMemo } from 'react';
import { ItemsHeader } from './components/ItemsHeader';
import { CreateItemDialog } from './components/CreateItemDialog';
import type { Item, ItemFormData } from './types';
import { DataTable, type Column } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Trash } from 'lucide-react';
import { ConformationModal } from '@/components/common/ConformationModal';

import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useExportItems,
  useItemDetails
} from './hooks/useItems';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { useDebounce } from '@/hooks/useDebounce';

export default function MyItemsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // 500ms delay
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);

  const { data: itemsData, isLoading } = useItems({
    search: debouncedSearch,
    pageSize,
    page
  });
  const { data: editingItemData, isLoading: isItemLoading } = useItemDetails(editingItemId || undefined);

  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();
  const exportItemsMutation = useExportItems();

  const handleSearch = useCallback((search: string) => {
    setSearch(search);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPageSize(pageSize);
    setPage(1);
  }, []);

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

  const handleFormSubmit = useCallback((data: ItemFormData) => {
    if (editingItemId) {
      updateItemMutation.mutate({ id: editingItemId, data }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createItemMutation.mutate(data, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  }, [editingItemId, createItemMutation, updateItemMutation]);

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
    },
    {
      key: "item_code",
      accessor: "item_code",
      header: "Item Code",
      sortable: true,
      searchable: true,
    },
    {
      key: "item_cubic",
      accessor: "item_cubic",
      header: "Item Cubic",
      sortable: true,
      cell: (val) => typeof val === 'number' ? val.toFixed(4) : val
    },
    {
      key: "status",
      accessor: "status",
      header: "Status",
      cell: (val) => (
        <Badge variant="secondary" className={cn(
          "px-2 py-0 h-5 text-[10px] font-bold border-none",
          val === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        )}>
          {val as string}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-20 px-0 pr-3",
      cell: (_, row) => (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-0 hover:text-blue-600 bg-transparent dark:hover:bg-transparent" onClick={() => handleEditItem(row)}>
            {isItemLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Pencil className='h-4 w-4' />}
          </Button>
          <Button variant="ghost" size="sm" className="p-0 hover:text-red-600 bg-transparent dark:hover:bg-transparent" onClick={() => handleDeleteClick(row.id)}>
            <Pencil className='h-4 w-4 hidden' /> {/* Hidden pencil to maintain spacing if needed */}
            <Trash className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ], [handleEditItem, handleDeleteClick, isItemLoading]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className='rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 '>
        <DataTable
          columns={columns}
          data={itemsData?.data || []}
          loading={isLoading}
          searchPlaceholder="Search items..."
          onSearchChange={handleSearch}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          pageSizeInFooter
          customHeader={<ItemsHeader onAddItem={handleAddItem} />}
          headerTitle='My Items'
          headerDescription='Manage your shipping items, dimensions, and cubic measurements.'
          headerClass="h-20"
          className='pb-3'
          onExport={(type) => handleExport(type)}
          isExporting={exportItemsMutation.isPending}
        />

        <CreateItemDialog
          key={isDialogOpen ? `item-${editingItemId || 'new'}-${!!editingItemData}` : 'closed'}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleFormSubmit}
          editItem={editingItemData?.data}
          isLoading={createItemMutation.isPending || updateItemMutation.isPending}
        />

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
