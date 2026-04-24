import { useState, useCallback, useMemo } from 'react';
import { Calendar as CalendarIcon, Activity, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/common';
import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { ACTIVITY_COLUMNS, MOCK_ACTIVITIES } from '../constants';

export default function ActivityLogPage() {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [role, setRole] = useState<string>('all');
    const [action, setAction] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(1);

    const handleReset = useCallback(() => {
        setStartDate(undefined);
        setEndDate(undefined);
        setRole('all');
        setAction('all');
        setSearch('');
        setPage(1);
    }, []);

    // Filter logic for mock data
    const filteredData = useMemo(() => {
        return MOCK_ACTIVITIES.filter(item => {
            if (role !== 'all' && item.adminRole !== role) return false;
            if (action !== 'all' && item.action !== action) return false;
            if (search && !item.description.toLowerCase().includes(search.toLowerCase()) && !item.email.toLowerCase().includes(search.toLowerCase())) return false;
            if (startDate && new Date(item.dateTime) < startDate) return false;
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                if (new Date(item.dateTime) > endOfDay) return false;
            }
            return true;
        });
    }, [role, action, search, startDate, endDate]);

    return (
        <div className="flex flex-col flex-1 gap-6 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30 overflow-y-auto">
            {/* Filter Section */}
            <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] space-y-4 print:hidden">
                <div className="flex items-center justify-between">
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
                        className="h-9 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold uppercase tracking-widest text-[10px] gap-2 px-3 transition-all"
                    >
                        <XCircle className="w-3.5 h-3.5" />
                        Clear Filters
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4">
                    <div className="lg:col-span-2">
                        <FormSelect
                            label="Role"
                            value={role}
                            onValueChange={(val) => setRole(val || 'all')}
                            options={[
                                { label: 'All Roles', value: 'all' },
                                { label: 'Admin', value: 'Admin' },
                                { label: 'Sub Admin', value: 'Sub Admin' },
                            ]}
                            placeholder="All Roles"
                            className="w-full space-y-1.5"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <FormSelect
                            label="Action"
                            value={action}
                            onValueChange={(val) => setAction(val || 'all')}
                            options={[
                                { label: 'All Actions', value: 'all' },
                                { label: 'Created', value: 'Created' },
                                { label: 'Updated', value: 'Updated' },
                                { label: 'Deleted', value: 'Deleted' },
                                { label: 'Logged In', value: 'Logged In' },
                            ]}
                            placeholder="All Actions"
                            className="w-full space-y-1.5"
                        />
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider ml-0.5">Start Date</label>
                        <Popover>
                            <PopoverTrigger>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-8 justify-between text-left text-[12px] border-slate-200 dark:border-zinc-800 rounded-md px-3 bg-white dark:bg-zinc-950",
                                        !startDate && "text-slate-400"
                                    )}
                                >
                                    {startDate ? format(startDate, "dd/MM/yyyy") : <span>DD/MM/YYYY</span>}
                                    <CalendarIcon className="h-3.5 w-3.5 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-1.5">
                        <label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider ml-0.5">End Date</label>
                        <Popover>
                            <PopoverTrigger>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-8 justify-between text-left text-[12px] font-medium border-slate-200 dark:border-zinc-800 rounded-md px-3 bg-white dark:bg-zinc-950",
                                        !endDate && "text-slate-400"
                                    )}
                                >
                                    {endDate ? format(endDate, "dd/MM/yyyy") : <span>DD/MM/YYYY</span>}
                                    <CalendarIcon className="h-3.5 w-3.5 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="lg:col-span-2 content-end mb-1">
                        <Button
                            className="w-full h-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-[11px] rounded-md shadow-sm shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            onClick={() => setPage(1)}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className='rounded-2xl min-h-[500px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 flex flex-col border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden'>
                <DataTable
                    columns={ACTIVITY_COLUMNS as any}
                    data={filteredData}
                    searchable
                    searchValue={search}
                    onSearchChange={(val) => { setSearch(val); setPage(1); }}
                    pageSize={pageSize}
                    onPageSizeChange={(val) => { setPageSize(Number(val)); setPage(1); }}
                    className="pb-3 text-xs"
                    totalItems={filteredData.length}
                    currentPage={page}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
