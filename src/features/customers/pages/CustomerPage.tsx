import { useState, useMemo } from 'react';
import { Users, UserCheck, UserX, Plus } from 'lucide-react';
import { DataTable, StatCard } from '@/components/common';
import SelectComponent from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MOCK_CUSTOMERS, SUBURBS, STATES } from '../constants';
import { CUSTOMER_COLUMNS } from '../columns';
import AddCustomerDialog from '../components/AddCustomerDialog';

export default function CustomerPage() {
    const [suburb, setSuburb] = useState('all');
    const [state, setState] = useState('all');
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(7);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const stats = useMemo(() => [
        {
            label: 'Total Customer',
            value: '17',
            icon: Users,
            iconColor: 'text-slate-600',
            iconBg: 'bg-slate-50 dark:bg-slate-500/10',
        },
        {
            label: 'Active Customer',
            value: '15',
            icon: UserCheck,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
        },
        {
            label: 'Inactive Customer',
            value: '2',
            icon: UserX,
            iconColor: 'text-rose-600',
            iconBg: 'bg-rose-50 dark:bg-rose-500/10',
        },
    ], []);

    const suburbOptions = useMemo(() => [
        { label: 'All Suburbs', value: 'all' },
        ...SUBURBS.map(s => ({ label: s, value: s.toLowerCase() }))
    ], []);

    const stateOptions = useMemo(() => [
        { label: 'All States', value: 'all' },
        ...STATES.map(s => ({ label: s, value: s.toLowerCase() }))
    ], []);

    const filteredData = useMemo(() => {
        let data = MOCK_CUSTOMERS;

        if (suburb !== 'all') {
            data = data.filter(c => c.suburb.toLowerCase() === suburb);
        }

        if (state !== 'all') {
            data = data.filter(c => c.state.toLowerCase() === state);
        }

        if (search) {
            data = data.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        return data;
    }, [suburb, state, search]);

    return (
        <div className="flex flex-col flex-1 gap-4 p-page-padding min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50/30 dark:bg-zinc-950/30">

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        className="shadow-sm border-gray-100 dark:border-zinc-800"
                        contentClassName="py-4"
                    />
                ))}
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectComponent
                        data={suburbOptions}
                        value={suburb}
                        onValueChange={(val) => setSuburb(val || 'all')}
                        placeholder="Select Suburb"
                        className="h-10 border-gray-200 dark:border-zinc-800"
                    />
                    <SelectComponent
                        data={stateOptions}
                        value={state}
                        onValueChange={(val) => setState(val || 'all')}
                        placeholder="Select State"
                        className="h-10 border-gray-200 dark:border-zinc-800"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-xl shadow-md flex-1 flex flex-col min-h-0 border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
                <DataTable
                    columns={CUSTOMER_COLUMNS as any}
                    data={filteredData}
                    headerTitle="Customer"
                    searchable
                    searchValue={search}
                    onSearchChange={setSearch}
                    pageSize={pageSize}
                    onPageSizeChange={(val) => setPageSize(Number(val))}
                    className="pb-3"
                    customHeader={(
                        <Button
                            size="sm"
                            variant="default"
                            className="h-8 rounded-lg"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Customer
                        </Button>
                    )}
                    totalItems={MOCK_CUSTOMERS.length}
                />
            </div>

            <AddCustomerDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
            />
        </div>
    );
}
