import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OrdersFilters } from './components/OrdersFilters';
import { OrdersTable } from './components/OrdersTable';
import { OrdersPagination } from './components/OrdersPagination';
import { CreateOrderDialog } from './components/CreateOrderDialog';
import { getNestedValue } from '@/lib/utils';
import type { Order, TabType, FilterItem } from './types';
import { MOCK_ORDERS_DATA } from './constants';

export default function Orders() {
  // State
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabType) || 'New';
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [orderDialogMode, setOrderDialogMode] = useState<'receiver' | 'return' | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });
  const [activeFilters, setActiveFilters] = useState<FilterItem[]>([]);

  const checkFilterMatch = (order: Order, filter: FilterItem): boolean => {
    const categoryToKey: Record<string, string> = {
      'Name': 'receiver_payload.name',
      'Address': 'receiver_payload.address1',
      'Source': 'source',
      'State': 'receiver_payload.state',
      'Country': 'receiver_payload.country',
      'Carrier': 'courier_name',
      'Service': 'aust_post_product_type',
      'Status': 'status',
      'Weight': 'total_weight',
      'Tags': 'tags',
    };

    const key = categoryToKey[filter.category];
    if (!key && filter.category !== 'Date') return false;

    const value = getNestedValue(order, key);
    const filterValue = filter.value.toLowerCase();

    if (filter.category === 'Status') {
      const statusLabel = order.status === 1 ? 'Pending' : order.status === 2 ? 'Printed' : order.status === 3 ? 'Shipped' : 'Archived';
      return statusLabel.toLowerCase() === filterValue;
    }

    if (filter.category === 'Date') {
      if (!order.created_at) return false;
      const dateParts = order.created_at.split(' ')[0].split('/');
      if (dateParts.length === 3) {
        const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`));
        return monthYear.toLowerCase() === filterValue;
      }
    }

    if (filter.category === 'Weight') {
      const weightValue = order.total_weight || 0;
      if (filter.value === '<= 2') return weightValue <= 2;
      if (filter.value === '>= 2') return weightValue >= 2;
      return String(weightValue) === filter.value;
    }

    if (filter.category === 'Source') {
      const sourceMatch = String(value || "").match(/<span>([^<]+)<\/span>/);
      const source = sourceMatch ? sourceMatch[1] : String(value || "");
      return source.toLowerCase() === filterValue;
    }

    if (filter.category === 'Tags') {
      return Array.isArray(order.tags) && order.tags.some(t => t.toLowerCase() === filterValue);
    }

    const stringValue = String(value || "").toLowerCase();
    if (filter.category === 'Country' && stringValue === 'au') {
      return 'australia' === filterValue;
    }

    return stringValue === filterValue;
  };

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS_DATA.filter(order => {
      // 1. Tab filtering (Uncommented - New tab should filter by status 1)
      const matchesTab = activeTab === 'New' ? order.status === 1 :
        activeTab === 'Printed' ? order.status === 2 :
          activeTab === 'Shipped' ? order.status === 3 :
            order.status === 4;

      if (!matchesTab) return false;

      // 2. Text Search
      const fullName = (order.user.first_name + ' ' + order.user.last_name).toLowerCase();
      const matchesSearch = !searchQuery ||
        fullName.includes(searchQuery.toLowerCase()) ||
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
      console.log(searchQuery, matchesSearch, 'matchesSearch', fullName);
      if (!matchesSearch) return false;

      // 3. Advanced Multi-Filters
      if (activeFilters.length > 0) {
        // Exclude filters must NONE match
        const hasExcludeMatch = activeFilters.some(f => f.type === 'exclude' && checkFilterMatch(order, f));
        if (hasExcludeMatch) return false;

        // Include filters: For each category with include filters, at least one must match
        const includeCategories = Array.from(new Set(activeFilters.filter(f => f.type === 'include').map(f => f.category)));
        for (const cat of includeCategories) {
          const catFilters = activeFilters.filter(f => f.category === cat && f.type === 'include');
          const isCatMatched = catFilters.some(f => checkFilterMatch(order, f));
          if (!isCatMatched) return false;
        }
      }

      return true;
    });
  }, [activeTab, searchQuery, activeFilters]);

  console.log(filteredOrders)

  // Sorting Logic
  const sortedOrders = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredOrders;

    return [...filteredOrders].sort((a, b) => {
      const key = sortConfig.key as keyof Order;
      const aRaw = a[key];
      const bRaw = b[key];
      let aValue: string | number = (typeof aRaw === 'string' || typeof aRaw === 'number') ? aRaw : '';
      let bValue: string | number = (typeof bRaw === 'string' || typeof bRaw === 'number') ? bRaw : '';

      // Special handling for Amount (currency)
      if (key.toString().toLowerCase() === 'amount') {
        const parseAmount = (val: string | number | null | undefined) => {
          if (typeof val !== 'string') return 0;
          const cleaned = val.replace(/[$, ]/g, '');
          return cleaned === '-' ? 0 : parseFloat(cleaned) || 0;
        };
        aValue = parseAmount(aValue);
        bValue = parseAmount(bValue);
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedOrders, currentPage, itemsPerPage]);

  // const paginatedOrders = [sortedOrders[0]];


  // Handlers
  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return { key: null, direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className="p-page-padding flex-1 flex flex-col space-y-4 animate-in fade-in duration-700 h-full overflow-hidden min-h-0 bg-white dark:bg-zinc-950">
      <OrdersFilters
        orders={MOCK_ORDERS_DATA}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onAddFilter={(filter) => {
          if (!activeFilters.some(f => f.id === filter.id)) {
            setActiveFilters([...activeFilters, filter]);
          }
        }}
        onRemoveFilter={(id) => setActiveFilters([...activeFilters.filter(f => f.id !== id)])}
        onClearAllFilters={() => setActiveFilters([])}
        onReplaceFilter={(id, filter) => {
          setActiveFilters([...activeFilters.filter(f => f.id !== id), filter]);
        }}
        onCreateOrderClick={setOrderDialogMode}
      />

      <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0 transition-colors duration-300">
        <OrdersTable
          orders={paginatedOrders}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        <OrdersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalFilteredItems={filteredOrders.length}
          onItemsPerPageChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
        />
      </div>

      {orderDialogMode && (
        <CreateOrderDialog
          open={!!orderDialogMode}
          onOpenChange={(open) => !open && setOrderDialogMode(null)}
          type={orderDialogMode}
        />
      )}
    </div>
  );
}
