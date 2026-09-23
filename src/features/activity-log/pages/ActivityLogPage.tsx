import { useCallback, useMemo } from 'react';
import { XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { FormSelect, CustomLabel } from '@/features/orders/components/OrderFormUI';
import { ACTIVITY_COLUMNS } from '../constants';
import { useActivityLog } from '../hooks/useActivityLog';
import { useDebounce } from '@/hooks/useDebounce';
import { DateFilter } from '@/components/common/DateFilter';
import type { DateFilterValue } from '@/components/common/DateFilter/types';
<<<<<<< HEAD
import { hydrateDateFilter } from '@/components/common/DateFilter/utils';
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import useLocalStorage from '@/hooks/useLocalStorage';

export default function ActivityLogPage() {
    const [dateRange, setDateRange] = useLocalStorage<DateFilterValue>('activity_log_date_range', {
        type: 'custom',
        from: '',
        to: '',
        label: 'All Time',
<<<<<<< HEAD
    }, hydrateDateFilter);
=======
    });
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    const [role, setRole] = useLocalStorage<string>('activity_log_role', 'all');
    const [action, setAction] = useLocalStorage<string>('activity_log_action', 'all');
    const [search, setSearch] = useLocalStorage<string>('activity_log_search', '');
    const [pageSize, setPageSize] = useLocalStorage<number>('activity_log_page_size', 25);
    const [page, setPage] = useLocalStorage<number>('activity_log_current_page', 1);

    const handleReset = useCallback(() => {
        setDateRange({
            type: 'custom',
            from: '',
            to: '',
            label: 'All Time',
        });
        setRole('all');
        setAction('all');
        setSearch('');
        setPage(1);
    }, [setDateRange, setRole, setAction, setSearch, setPage]);

    const queryParams = useMemo(() => {
        const params: any = {
            page,
            per_page: pageSize,
        };
        if (role !== 'all') params.role = role.toLowerCase();
        if (action !== 'all') params.action = action;
        if (dateRange.from) params.from_date = dateRange.from;
        if (dateRange.to) params.to_date = dateRange.to;
        return params;
    }, [page, pageSize, role, action, dateRange]);

    const { data: activityData, isLoading, refetch, isRefetching } = useActivityLog({ ...queryParams, search: useDebounce(search, 500) });

    const activities = activityData?.data || [];
    const totalItems = activityData?.meta?.total || 0;

    const customHeader = useMemo(() => (<Button
        className="h-8 bg-primary hover:bg-primary-hover text-white rounded-md shadow-sm shadow-primary/20 transition-all"
        onClick={() => refetch()}
        disabled={!!isRefetching}
    >
        {isRefetching && <Loader2 className="w-4 h-4 animate-spin" />}
        Refresh Log
    </Button>), [isRefetching, refetch])

    return (
        <div className="flex flex-col flex-1 gap-4 p-page-padding animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
            {/* Filter Section */}
            <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] space-y-4 print:hidden">
                {/* <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200 tracking-tight">Admin Activities</h2>
                    </div>
                    <Button
                        onClick={handleReset}
                        variant="ghost"
                        size="sm"
                        className="h-9 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold uppercase tracking-wide text-[10px] gap-2 px-3 transition-all"
                    >
                        <XCircle className="w-3.5 h-3.5" />
                        Clear Filters
                    </Button>
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4">
                    <div className="lg:col-span-2">
                        <FormSelect
                            label="Role"
                            value={role}
                            onValueChange={(val) => { setRole(val || 'all'); setPage(1); }}
                            options={[
                                { label: 'All Roles', value: 'all' },
                                { label: 'Admin', value: 'admin' },
                                { label: 'Staff', value: 'staff' },
                            ]}
                            placeholder="All Roles"
                            className="w-full space-y-1.5"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <FormSelect
                            label="Action"
                            value={action}
                            onValueChange={(val) => { setAction(val || 'all'); setPage(1); }}
                            options={[
                                { label: 'All Actions', value: 'all' },
                                { label: 'Created', value: 'created' },
                                { label: 'Updated', value: 'updated' },
                                { label: 'Deleted', value: 'deleted' },
                                { label: 'Status Changed', value: 'status_changed' },
                                { label: 'Verified', value: 'verified' },
                                { label: 'Settings Updated', value: 'settings_updated' },
                            ]}
                            placeholder="All Actions"
                            className="w-full space-y-1.5"
                        />
                    </div>

                    <div className="lg:col-span-4 flex flex-col">
                        <CustomLabel label="Date Range" />
                        <DateFilter
                            value={dateRange}
                            onChange={(val) => { setDateRange(val); setPage(1); }}
                        />
                    </div>

                    <div className="lg:col-span-2 content-end ">
                        <Button
                            onClick={handleReset}
                            variant="ghost"
                            size="sm"
                            className="h-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold tracking-wide text-[11px] gap-1 px-3 transition-all"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Clear
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className='rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex-none h-auto border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950'>
                <DataTable
                    columns={ACTIVITY_COLUMNS as any}
                    data={activities}
                    searchable
                    headerTitle='Admin Activities'
                    searchValue={search}
                    onSearchChange={(val) => { setSearch(val); setPage(1); }}
                    pageSize={pageSize}
                    onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
                    className="pb-3 text-xs flex-none h-auto [&_div.overflow-auto]:flex-none [&_div.overflow-auto]:h-auto [&_div.overflow-auto]:min-h-0 [&_div.overflow-auto]:overflow-y-visible [&_div.overflow-auto]:overflow-x-auto"
                    totalItems={totalItems}
                    currentPage={page}
                    onPageChange={setPage}
                    loading={isLoading}
                    exportable={false}
                    customHeader={customHeader}
                />
            </div>
        </div>
    );
}

