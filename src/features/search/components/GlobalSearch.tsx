import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, FileText, MapPin, Box, Users } from 'lucide-react';
import { useAppSelector } from '@/hooks/store.hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { useGlobalSearch } from '../hooks/useSearch';
import { AutoComplete } from '@/components/common';

interface GlobalSearchProps {
    className?: string;
    placeholder?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
    className = "min-w-[300px] h-9",
    placeholder = "Search orders, invoices..."
}) => {
    const navigate = useNavigate();
    const { role } = useAppSelector((state) => state.auth);
    const isAdmin = role === 'admin';

    const [searchQuery, setSearchQuery] = React.useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const { data: searchResults } = useGlobalSearch(debouncedSearch);

    const searchOptions = React.useMemo(() => {
        if (!searchResults?.data) return [];
        const { orders, invoices, addresses, items, customers } = searchResults.data;

        const options: any[] = [];

        if (orders?.length) {
            orders.forEach((o: any) => options.push({
                value: `order-${o.id}`,
                label: o.order_number,
                type: 'Order',
                icon: ShoppingBag,
                order_type: o.order_type || 'new'
            }));
        }

        if (invoices?.length) {
            invoices.forEach((i: any) => options.push({
                value: `invoice-${i.id}`,
                label: i.invoice_number || `Invoice #${i.id}`,
                type: 'Invoice',
                icon: FileText
            }));
        }

        if (addresses?.length) {
            addresses.forEach((a: any) => options.push({
                value: `address-${a.id}`,
                label: a.contact_person,
                type: 'Address',
                icon: MapPin,
                id: a.id
            }));
        }

        if (customers?.length) {
            customers.forEach((c: any) => options.push({
                value: `customer-${c.id}`,
                label: c.name || c.business_name || c.email,
                type: 'Customer',
                icon: Users,
                id: c.id
            }));
        }

        if (items?.length) {
            items.forEach((it: any) => options.push({
                value: `item-${it.id}`,
                label: it.item_name,
                type: 'Item',
                icon: Box,
                id: it.id
            }));
        }

        return options;
    }, [searchResults]);
    console.log(searchOptions, 'searchOptions');
    const handleSearchSelect = (value: string) => {
        const [type, id] = value.split('-');
        const option = searchOptions.find(opt => opt.value === value);

        const prefix = isAdmin ? '/admin' : '';

        if (type === 'order') {
            const orderType = option?.order_type || 'new';
            navigate(`${prefix}/orders/${orderType}/${id}`);
        } else if (type === 'invoice') {
            navigate(`${prefix}/invoices/${id}`);
        } else if (type === 'address') {
            navigate(`${prefix}/address-book`);
        } else if (type === 'item') {
            navigate(`${prefix}/items`);
        } else if (type === 'customer') {
            navigate(`${prefix}/customers/${option?.id || id}`);
        }

        setSearchQuery("");
    };

    return (
        <AutoComplete
            placeholder={placeholder}
            className={className}
            options={searchOptions}
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handleSearchSelect}
            shouldFilter={false}
            renderOption={(option: any) => (
                <div className="flex items-center gap-3 py-1 w-full">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-50 dark:bg-zinc-800 text-slate-400">
                        {option.icon && <option.icon className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col flex-1">
                        <span className="text-[13px] font-medium text-slate-900 dark:text-zinc-100">{option.label}</span>
                        <span className="text-[11px] text-slate-500 dark:text-zinc-500 uppercase tracking-wider font-bold">{option.type}</span>
                    </div>
                </div>
            )}
        />
    );
};
