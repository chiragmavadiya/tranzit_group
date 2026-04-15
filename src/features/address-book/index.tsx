import { useState, useCallback, useMemo } from 'react';
import { AddressBookHeader } from './components/AddressBookHeader';
import { CreateAddressDialog } from './components/CreateAddressDialog';
import { MOCK_ADDRESSES } from './constants';
import type { Address, AddressFormData } from './types';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { ConformationModal } from '@/components/common/ConformationModal';

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(null);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(50);

  const handleSearch = useCallback((search: string) => {
    setSearch(search);
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPageSize(pageSize);
  }, []);

  const handleAddAddress = useCallback(() => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditAddress = useCallback((addr: Address) => {
    setEditingAddress({
      id: addr.id,
      code: addr.code,
      contact_person: addr.contact_person,
      business_name: addr.business_name,
      email_id: addr.email_id,
      mobile: addr.mobile,
      address: addr.address,
    });
    setIsDialogOpen(true);
  }, []);

  const handleFormSubmit = useCallback((data: AddressFormData) => {
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id ? { ...addr, ...data } : addr
        )
      );
      toast.success('Address updated successfully');
    } else {
      const newAddress: Address = {
        id: Math.floor(Math.random() * 1000000),
        ...data,
        is_active: 1,
      } as Address;
      setAddresses((prev) => [newAddress, ...prev]);
      toast.success('Address created successfully');
    }
  }, [editingAddress]);

  const onSubmitDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    toast.success('Address deleted successfully');
  }, []);

  const onCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

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
      key: "email_id",
      accessor: "email_id",
      header: "EMAIL ID",
      sortable: true,
      searchable: true,
    },
    {
      key: "mobile",
      accessor: "mobile",
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
      className: "w-20 px-0 pr-3",
      cell: (_, row) => (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-0 hover:text-blue-600 bg-transparent dark:hover:bg-transparent" onClick={() => handleEditAddress(row)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button variant="ghost" size="sm" className="p-0 hover:text-red-600 bg-transparent dark:hover:bg-transparent" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ], [handleEditAddress]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <DataTable
        columns={columns}
        data={addresses}
        searchPlaceholder="Search addresses..."
        onSearchChange={handleSearch}
        searchValue={search}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        pageSizeInFooter
        customHeader={<AddressBookHeader onAddAddress={handleAddAddress} />}
        headerClass="h-20"
      />
      
      <CreateAddressDialog
        key={isDialogOpen ? (editingAddress?.id || 'new') : 'closed'}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        editAddress={editingAddress}
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
        loading={false}
        className="w-full"
      />
    </div>
  );
}
