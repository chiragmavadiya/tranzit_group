import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/common';
import { ConformationModal } from '@/components/common/ConformationModal';
import { Button } from '@/components/ui/button';
import { POSTCODE_COLUMNS } from '../columns';
import { MOCK_POSTCODES } from '../constants';
import { AddPostcodeDialog } from '../components/AddPostcodeDialog';
import type { CourierPostcode } from '../types';

export default function CourierPostcodePage() {
  const [data, setData] = useState<CourierPostcode[]>(MOCK_POSTCODES);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CourierPostcode | null>(null);
  const [deletingRow, setDeletingRow] = useState<CourierPostcode | null>(null);

  const handleAddPostcode = (formData: Partial<CourierPostcode>) => {
    if (editingRow) {
      setData(prev => prev.map(item => item.id === editingRow.id ? { ...item, ...formData } as CourierPostcode : item));
    } else {
      const newPostcode: CourierPostcode = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as CourierPostcode;
      setData(prev => [newPostcode, ...prev]);
    }
    setIsAddOpen(false);
    setEditingRow(null);
  };

  const handleDelete = () => {
    if (deletingRow) {
      setData(prev => prev.filter(item => item.id !== deletingRow.id));
      setDeletingRow(null);
    }
  };

  const onAddPostcode = () => {
    setEditingRow(null);
    setIsAddOpen(true);
  };

  const columns = useMemo(() => POSTCODE_COLUMNS(
    (row) => {
      setEditingRow(row);
      setIsAddOpen(true);
    },
    (row) => {
      setDeletingRow(row);
    }
  ), []);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.courierName.toLowerCase().includes(search.toLowerCase()) ||
      item.postCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <DataTable
          headerTitle="Courier Based PostCode"
          columns={columns}
          data={filteredData}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          totalItems={filteredData.length}
          className="text-xs pb-3"
          customHeader={
            <Button
              onClick={onAddPostcode}
              className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-semibold border-none px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Add Postcode</span>
            </Button>
          }
        />
      </div>

      <AddPostcodeDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddPostcode}
        initialData={editingRow}
      />

      <ConformationModal
        open={!!deletingRow}
        onOpenChange={(open) => !open && setDeletingRow(null)}
        onConfirm={handleDelete}
        title="Delete Postcode"
        description={`Are you sure you want to delete the postcode mapping for "${deletingRow?.courierName}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
