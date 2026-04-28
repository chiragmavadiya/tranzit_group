import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/common';
import { ConformationModal } from '@/components/common/ConformationModal';
import { Button } from '@/components/ui/button';
import { ARTICLE_COLUMNS } from '../columns';
import { AddArticleDialog } from '../components/AddArticleDialog';
import { useHelpArticles, useHelpArticleMutations } from '../hooks/useHelpCenterAdmin';
import type { HelpArticle } from '../types';
import { useDebounce } from '@/hooks/useDebounce';

export default function HelpCenterAdminPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<HelpArticle | null>(null);
  const [deletingRow, setDeletingRow] = useState<HelpArticle | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: response, isLoading } = useHelpArticles({
    search: debouncedSearch,
    page,
    per_page: pageSize
  });

  const { deleteArticle, isDeleting } = useHelpArticleMutations();

  const handleDelete = () => {
    if (deletingRow) {
      deleteArticle(deletingRow.id, {
        onSuccess: () => setDeletingRow(null)
      });
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

  return (
    <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <DataTable
          headerTitle="Help Articles"
          headerDescription="Create and manage your portal help articles."
          columns={columns}
          data={response?.data || []}
          loading={isLoading}
          searchable
          searchValue={search}
          onSearchChange={setSearch}
          totalItems={response?.meta?.total || 0}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          className="text-xs pb-3"
          exportable={false}
          customHeader={
            <Button
              onClick={onAddArticle}
              className="global-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Article</span>
            </Button>
          }
        />
      </div>

      <AddArticleDialog
        open={isAddOpen}
        onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) setEditingRow(null);
        }}
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
        loading={isDeleting}
      />
    </div>
  );
}
