import { useState, useCallback, useMemo } from 'react';
import { ItemsHeader } from './components/ItemsHeader';
import { CreateItemDialog } from './components/CreateItemDialog';
import { MOCK_ITEMS } from './constants';
import type { Item, ItemFormData } from './types';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/common';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { ConformationModal } from '@/components/common/ConformationModal';

export default function MyItemsPage() {
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormData | null>(null);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(50);

  const handleSearch = useCallback((search: string) => {
    setSearch(search);
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPageSize(pageSize);
  }, []);

  const handleToggleStatus = useCallback((id: number, status: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_active: status ? 1 : 0 } : item))
    );
    toast.success('Status updated successfully');
  }, []);

  const handleAddItem = useCallback(() => {
    setEditingItem(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditItem = useCallback((item: unknown) => {
    console.log(item);
    setEditingItem({
      "id": 8,
      "item_code": "5465",
      "item_name": "sdf",
      "item_weight": 4234.00,
      "item_length": 234.00,
      "item_height": 234.00,
      "item_width": 234.00,
      "item_cubic": 32.0000,
      "is_default": true,
    });
    setIsDialogOpen(true);
  }, []);

  const handleFormSubmit = useCallback((data: ItemFormData) => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...data } : item
        )
      );
      toast.success('Item updated successfully');
    } else {
      const newItem: Item = {
        id: Math.floor(Math.random() * 1000000), // Simple numeric ID
        ...data,
      } as unknown as Item;
      setItems((prev) => [newItem, ...prev]);
      toast.success('Item created successfully');
    }
  }, [editingItem]);

  const onSubmitDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const onCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

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
    },
    {
      key: "is_active",
      accessor: "is_active",
      header: "Status",
      cell: (_, row) => (
        <Switch
          checked={!!row.is_active}
          onCheckedChange={(checked: boolean) => handleToggleStatus(row.id, checked)}
        />
      )
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-20 px-0 pr-3",
      cell: (_, row) => (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-0 hover:text-blue-600 bg-transparent dark:hover:bg-transparent" onClick={() => handleEditItem(row)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button variant="ghost" size="sm" className="p-0 hover:text-red-600 bg-transparent dark:hover:bg-transparent" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ], [handleToggleStatus, handleEditItem]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* <ItemsHeader onAddItem={handleAddItem} /> */}

      <DataTable
        columns={columns}
        data={items}
        searchPlaceholder="Search items..."
        onSearchChange={handleSearch}
        searchValue={search}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        pageSizeInFooter
        customHeader={<ItemsHeader onAddItem={handleAddItem} />}
        headerClass="h-20"
      />
      {/* Modals */}
      {/* create */}
      <CreateItemDialog
        key={isDialogOpen ? (editingItem?.id || 'new') : 'closed'}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        editItem={editingItem}
      />
      {/* conformation */}
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
        loading={false}
        className="w-full"
      />
    </div>
  );
}
