import React, { useState } from 'react';
import { DataTable } from './DataTable';
import { 
  StatusCell, 
  LinkCell, 
  ActionsCell, 
  DateCell, 
  CurrencyCell, 
  AvatarCell,
  createCommonActions 
} from './DataTableCells';
import type { Column, SortConfig } from './types/DataTable.types';

// Example data type
interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
  createdAt: string;
  lastLogin: string;
  avatar?: string;
  salary: number;
}

// Example data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'Admin',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-04-14T15:45:00Z',
    salary: 75000,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'pending',
    role: 'User',
    createdAt: '2024-02-20T09:15:00Z',
    lastLogin: '2024-04-13T11:20:00Z',
    salary: 65000,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'inactive',
    role: 'Moderator',
    createdAt: '2024-03-10T14:22:00Z',
    lastLogin: '2024-04-10T08:30:00Z',
    salary: 70000,
  },
];

export const DataTableExample: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Define columns
  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'User',
      accessor: 'name',
      cell: (value, row) => (
        <AvatarCell 
          name={row.name} 
          email={row.email} 
          image={row.avatar} 
        />
      ),
      width: '250px',
      sticky: 'left',
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      cell: (value) => (
        <LinkCell 
          value={value} 
          href={`mailto:${value}`}
          external
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      cell: (value) => <StatusCell value={value} />,
      width: '120px',
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role',
    },
    {
      key: 'salary',
      header: 'Salary',
      accessor: 'salary',
      cell: (value) => <CurrencyCell value={value} />,
      width: '120px',
    },
    {
      key: 'createdAt',
      header: 'Created',
      accessor: 'createdAt',
      cell: (value) => <DateCell value={value} format="short" />,
      width: '120px',
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      accessor: 'lastLogin',
      cell: (value) => <DateCell value={value} format="relative" />,
      width: '120px',
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (_, row) => (
        <ActionsCell
          row={row}
          actions={createCommonActions(
            (user) => console.log('View user:', user),
            (user) => console.log('Edit user:', user),
            (user) => console.log('Delete user:', user)
          )}
        />
      ),
      width: '100px',
      sticky: 'right',
      sortable: false,
      searchable: false,
    },
  ];

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">DataTable Example</h2>
        <p className="text-gray-600">
          A comprehensive example showing all features of the reusable DataTable component.
        </p>
      </div>

      <DataTable
        data={sampleUsers}
        columns={columns}
        rowKey="id"
        // Selection
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        // Sorting
        sortable
        sortConfig={sortConfig}
        onSort={handleSort}
        // Pagination
        pagination
        pageSize={10}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        // Search
        searchable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search users..."
        // Column management
        columnSettings
        // Styling
        className="border rounded-lg"
        // Row actions
        onRowClick={(user) => console.log('Row clicked:', user)}
        // Custom header
        customHeader={
          <div>
            <h3 className="text-lg font-semibold">Users Management</h3>
            <p className="text-sm text-gray-500">Manage your team members</p>
          </div>
        }
      />

      {/* Selection info */}
      {selectedRows.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {selectedRows.length} user{selectedRows.length !== 1 ? 's' : ''} selected
          </p>
          <div className="mt-2 flex gap-2">
            <button 
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => console.log('Bulk action on:', selectedRows)}
            >
              Bulk Action
            </button>
            <button 
              className="text-xs bg-gray-600 text-white px-3 py-1 rounded"
              onClick={() => setSelectedRows([])}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple example for basic usage
export const SimpleDataTableExample: React.FC = () => {
  const simpleData = [
    { id: '1', name: 'Product A', price: 29.99, category: 'Electronics' },
    { id: '2', name: 'Product B', price: 49.99, category: 'Clothing' },
    { id: '3', name: 'Product C', price: 19.99, category: 'Books' },
  ];

  const simpleColumns: Column<typeof simpleData[0]>[] = [
    { key: 'name', header: 'Product Name', accessor: 'name' },
    { key: 'category', header: 'Category', accessor: 'category' },
    { 
      key: 'price', 
      header: 'Price', 
      accessor: 'price',
      cell: (value) => <CurrencyCell value={value} />
    },
  ];

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">Simple DataTable</h3>
      <DataTable
        data={simpleData}
        columns={simpleColumns}
        rowKey="id"
        className="border rounded-lg"
      />
    </div>
  );
};