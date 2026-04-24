import { useState, useCallback, useMemo } from 'react';
import { AddressBookHeader } from './components/AddressBookHeader';
import { CreateAddressDialog } from './components/CreateAddressDialog';
import type { Address, AddressFormData } from './types';
import { DataTable, type Column } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { ConformationModal } from '@/components/common/ConformationModal';
import {
  useAddressBookList,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useExportAddressBook
} from './hooks/useAddressBook';

export default function AddressBookPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // API Hooks
  const { data, isLoading } = useAddressBookList({
    search,
    page: currentPage,
    per_page: pageSize
  });
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress(editingAddress?.id || '');
  const deleteMutation = useDeleteAddress();
  const exportMutation = useExportAddressBook();

  const handleSearch = useCallback((search: string) => {
    setSearch(search);
    setCurrentPage(1);
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    console.log(pageSize, "PAGE SIZE");
    setPageSize(pageSize);
    setCurrentPage(1);
  }, []);

  const handleAddAddress = useCallback(() => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditAddress = useCallback((addr: Address) => {
    // Mapping Address to AddressFormData
    setEditingAddress({
      id: addr.id,
      code: addr.code,
      contact_person: addr.contact_person,
      business_name: addr.business_name,
      email: addr.email,
      phone: addr.phone,
      unit_number: addr.unit_number,
      street_number: addr.street_number,
      street_name: addr.street_name,
      street_type: addr.street_type,
      suburb: addr.suburb,
      state: addr.state,
      postcode: addr.postcode,
      latitude: Number(addr.latitude),
      longitude: Number(addr.longitude),
      additional_details: addr.additional_details,
      special_instructions: addr.special_instructions,
      address: addr.address,
    });
    setIsDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback((id: number | string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleFormSubmit = useCallback((formData: AddressFormData) => {
    if (editingAddress?.id) {
      updateMutation.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  }, [editingAddress, updateMutation, createMutation]);

  const onSubmitDelete = useCallback(() => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingId(null);
        }
      });
    }
  }, [deletingId, deleteMutation]);

  const onCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  }, []);

  const onExport = useCallback((format: string) => {
    exportMutation.mutate({ format, search });
  }, [exportMutation, search]);

  const columns = useMemo<Column<Address>[]>(() => [
    {
      key: "code",
      accessor: "code",
      header: "CODE",
      sortable: true,
      searchable: true,
    },
    {
      key: "contact_person",
      accessor: "contact_person",
      header: "CONTACT PERSON",
      sortable: true,
      searchable: true,
    },
    {
      key: "business_name",
      accessor: "business_name",
      header: "BUSINESS NAME",
      sortable: true,
      searchable: true,
    },
    {
      key: "email",
      accessor: "email",
      header: "EMAIL ID",
      sortable: true,
      searchable: true,
    },
    {
      key: "phone",
      accessor: "phone",
      header: "MOBILE",
      sortable: true,
    },
    {
      key: "address",
      accessor: "address",
      header: "ADDRESS",
      sortable: true,
    },
    {
      key: "actions",
      header: "ACTIONS",
      className: "w-20 px-0 pr-3 print:hidden",
      cell: (_, row) => (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-0 hover:text-blue-600 bg-transparent dark:hover:bg-transparent" onClick={() => handleEditAddress(row)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button variant="ghost" size="sm" className="p-0 hover:text-red-600 bg-transparent dark:hover:bg-transparent" onClick={() => handleConfirmDelete(row.id)}>
            <Trash className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ], [handleEditAddress, handleConfirmDelete]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className='rounded-lg shadow-sm flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 '>
        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          searchPlaceholder="Search addresses..."
          onSearchChange={handleSearch}
          searchValue={search}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          pageSizeInFooter
          customHeader={<AddressBookHeader onAddAddress={handleAddAddress} />}
          headerTitle='My Address Book'
          headerDescription="Manage your saved addresses, contact persons, and business details."
          headerClass="h-20"
          className='pb-3'
          totalItems={data?.meta?.total || 0}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onExport={onExport}
          isExporting={exportMutation.isPending}
        />

        <CreateAddressDialog
          key={isDialogOpen ? (editingAddress?.id || 'new') : 'closed'}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleFormSubmit}
          editAddress={editingAddress}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        <ConformationModal
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Address"
          description="Are you sure you want to delete this address?"
          onConfirm={onSubmitDelete}
          onCancel={onCancelDelete}
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="destructive"
          loading={deleteMutation.isPending}
          className="w-full"
        />
      </div>
    </div>
  );
}
