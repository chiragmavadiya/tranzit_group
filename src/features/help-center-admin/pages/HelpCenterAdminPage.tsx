import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/common';
import { ConformationModal } from '@/components/common/ConformationModal';
import { Button } from '@/components/ui/button';
import { ARTICLE_COLUMNS } from '../columns';
import { MOCK_ARTICLES } from '../constants';
import { AddArticleDialog } from '../components/AddArticleDialog';
import type { HelpArticle } from '../types';

export default function HelpCenterAdminPage() {
  const [data, setData] = useState<HelpArticle[]>(MOCK_ARTICLES);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<HelpArticle | null>(null);
  const [deletingRow, setDeletingRow] = useState<HelpArticle | null>(null);

  const handleAddArticle = (formData: Partial<HelpArticle>) => {
    if (editingRow) {
      setData(prev => prev.map(item => item.id === editingRow.id ? { ...item, ...formData, updatedAt: new Date().toISOString() } as HelpArticle : item));
    } else {
      const newArticle: HelpArticle = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        updatedAt: new Date().toISOString()
      } as HelpArticle;
      setData(prev => [newArticle, ...prev]);
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

  const onAddArticle = () => {
    setEditingRow(null);
    setIsAddOpen(true);
  };

  const columns = useMemo(() => ARTICLE_COLUMNS(
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
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Help Center Management</h1>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-medium">Create and manage your portal help articles.</p>
          </div>
        </div>
      </div> */}

      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <DataTable
          headerTitle="Help Articles"
          headerDescription="Create and manage your portal help articles."
          columns={columns}
          data={filteredData}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          totalItems={filteredData.length}
          className="text-xs pb-3"
          exportable={false}
          customHeader={
            <Button
              onClick={onAddArticle}
              className="gap-2 bg-[#0060FE] hover:bg-[#0052db] text-white shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] font-bold border-none px-5 h-9"
            >
              <Plus className="w-4 h-4" />
              <span>Add Article</span>
            </Button>
          }
        />
      </div>

      <AddArticleDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddArticle}
        initialData={editingRow}
      />

      <ConformationModal
        open={!!deletingRow}
        onOpenChange={(open) => !open && setDeletingRow(null)}
        onConfirm={handleDelete}
        title="Delete Article"
        description={`Are you sure you want to delete the article "${deletingRow?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
