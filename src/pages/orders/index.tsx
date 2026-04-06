import { useState, useMemo } from 'react';
import { OrdersHeader } from './components/OrdersHeader';
import { OrdersTabs } from './components/OrdersTabs';
import { OrdersFilters } from './components/OrdersFilters';
import { OrdersTable } from './components/OrdersTable';
import { OrdersPagination } from './components/OrdersPagination';
import type { TabType, MOCK_DATA_TYPE } from './types';
import { MOCK_DATA } from './constants';

export default function Orders() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return MOCK_DATA.filter(order => {
      // const matchesTab = order.status === activeTab;
      const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id_display.toLowerCase().includes(searchQuery.toLowerCase());
      // const matchesType = orderType === 'All Types' || order.type === orderType;
      const matchesStatus = statusFilter === 'All Statuses' || order.status === statusFilter;

      // const matchesDateFrom = !dateFrom || order.date >= dateFrom;
      // const matchesDateTo = !dateTo || order.date <= dateTo;

      return matchesSearch && matchesStatus;
    });
  }, [activeTab, searchQuery, orderType, statusFilter, dateFrom, dateTo]);

  // Sorting Logic
  const sortedOrders = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredOrders;

    return [...filteredOrders].sort((a, b) => {
      const key = sortConfig.key as keyof MOCK_DATA_TYPE;
      let aValue: any = a[key] ?? '';
      let bValue: any = b[key] ?? '';

      // Special handling for Amount (currency)
      if (key.toString().toLowerCase() === 'amount') {
        const parseAmount = (val: any) => {
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
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-700 h-full overflow-hidden min-h-0">
      <OrdersHeader />

      <OrdersTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <OrdersFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
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
    </div>
  );
}
