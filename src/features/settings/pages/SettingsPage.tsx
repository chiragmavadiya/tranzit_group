import { useState, useMemo, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSettings } from '../hooks/useSettings';
import { SettingsCard } from '../components/SettingsCard';
import { EditSettingDialog } from '../components/EditSettingDialog';
import type { Setting } from '@/features/settings/types';

export default function SettingsPage() {
  const [search, setSearch] = useState('');
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: response, isLoading } = useSettings();

  const filteredData = useMemo(() => {
    if (!response?.data) return [];
    return response.data.filter(setting =>
      setting.name.toLowerCase().includes(search.toLowerCase()) ||
      setting.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [response, search]);

  const handleEdit = useCallback((setting: Setting) => {
    setEditingSetting(setting);
    setIsDialogOpen(true);
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">System Settings</h1>
          <span className="text-sm text-slate-500 dark:text-zinc-400">Manage and configure global system-wide parameters.</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder="Search settings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 pr-4 rounded-xl border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 focus-visible:ring-blue-600/20 focus-visible:border-blue-600 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
            <Loader2 className="absolute inset-0 m-auto h-5 w-5 text-blue-600 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Loading system settings...</p>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-8">
          {filteredData.map((setting) => (
            <SettingsCard
              key={setting.id}
              setting={setting}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-950 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 min-h-[400px]">
          <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">No settings found</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Try adjusting your search query or filter.</p>
        </div>
      )}

      {/* Edit Dialog */}
      {isDialogOpen && (
        <EditSettingDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          setting={editingSetting}
        />
      )}
    </div>
  );
}
