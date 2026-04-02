import { useState, useMemo } from 'react';
import { OrdersHeader } from './components/OrdersHeader';
import { OrdersTabs } from './components/OrdersTabs';
import { OrdersFilters } from './components/OrdersFilters';
import { OrdersTable } from './components/OrdersTable';
import { OrdersPagination } from './components/OrdersPagination';
import type { TabType } from './types';
import { MOCK_ORDERS } from './constants';

export default function Orders() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter(order => {
      const matchesTab = order.status === activeTab;
      const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           order.id_display.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = orderType === 'All Types' || order.type === orderType;
      const matchesStatus = statusFilter === 'All Statuses' || order.status === statusFilter;
      
      return matchesTab && matchesSearch && matchesType && matchesStatus;
    });
  }, [activeTab, searchQuery, orderType, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Handlers
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-700">
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
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <OrdersTable orders={paginatedOrders} />
        
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
