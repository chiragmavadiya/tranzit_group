# DataTable Component

A comprehensive, reusable table component built with React and TypeScript. Features sorting, pagination, search, column management, row selection, and customizable cell renderers.

## Features

- ✅ **Sorting**: Click column headers to sort data
- ✅ **Pagination**: Built-in pagination with customizable page sizes
- ✅ **Search**: Global search across all searchable columns
- ✅ **Column Management**: Show/hide columns with settings dropdown
- ✅ **Row Selection**: Single or multi-row selection with checkboxes
- ✅ **Sticky Columns**: Pin columns to left or right
- ✅ **Custom Cell Renderers**: Rich content in cells (badges, links, actions, etc.)
- ✅ **Loading States**: Built-in loading and empty state handling
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Accessible**: Keyboard navigation and screen reader support
- ✅ **TypeScript**: Full type safety

## Basic Usage

```tsx
import { DataTable, Column } from '@/components/common';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
  // ... more data
];

const columns: Column<User>[] = [
  { key: 'name', header: 'Name', accessor: 'name' },
  { key: 'email', header: 'Email', accessor: 'email' },
  { key: 'status', header: 'Status', accessor: 'status' },
];

function UsersTable() {
  return (
    <DataTable
      data={users}
      columns={columns}
      rowKey="id"
    />
  );
}
```

## Advanced Usage

```tsx
import { 
  DataTable, 
  Column, 
  StatusCell, 
  ActionsCell, 
  createCommonActions 
} from '@/components/common';

function AdvancedUsersTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      sticky: 'left', // Pin to left
      width: '200px',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      cell: (value) => <StatusCell value={value} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (_, row) => (
        <ActionsCell
          row={row}
          actions={createCommonActions(
            (user) => viewUser(user),
            (user) => editUser(user),
            (user) => deleteUser(user)
          )}
        />
      ),
      sticky: 'right', // Pin to right
      sortable: false,
      searchable: false,
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      rowKey="id"
      // Selection
      selectable
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      // Sorting
      sortConfig={sortConfig}
      onSort={(key) => setSortConfig({ key, direction: 'asc' })}
      // Search
      searchable
      searchPlaceholder="Search users..."
      // Pagination
      pagination
      pageSize={25}
      // Row actions
      onRowClick={(user) => viewUser(user)}
      // Styling
      className="border rounded-lg shadow-sm"
    />
  );
}
```

## Column Configuration

### Basic Column

```tsx
{
  key: 'name',           // Unique identifier
  header: 'Full Name',   // Display header
  accessor: 'name',      // Data property to access
}
```

### Advanced Column Options

```tsx
{
  key: 'status',
  header: 'Status',
  accessor: 'status',
  cell: (value, row, index) => <StatusCell value={value} />, // Custom renderer
  sortable: true,        // Enable/disable sorting (default: true)
  searchable: true,      // Include in search (default: true)
  width: '120px',        // Fixed width
  className: 'text-center', // Custom CSS classes
  sticky: 'left',        // Pin column ('left' | 'right')
  hidden: false,         // Hide column by default
}
```

## Pre-built Cell Renderers

### StatusCell
```tsx
import { StatusCell } from '@/components/common';

{
  key: 'status',
  header: 'Status',
  cell: (value) => <StatusCell value={value} />
}
```

### LinkCell
```tsx
import { LinkCell } from '@/components/common';

{
  key: 'email',
  header: 'Email',
  cell: (value) => (
    <LinkCell 
      value={value} 
      href={`mailto:${value}`}
      external 
    />
  )
}
```

### ActionsCell
```tsx
import { ActionsCell, createCommonActions } from '@/components/common';

{
  key: 'actions',
  header: 'Actions',
  cell: (_, row) => (
    <ActionsCell
      row={row}
      actions={createCommonActions(
        (item) => viewItem(item),
        (item) => editItem(item),
        (item) => deleteItem(item)
      )}
    />
  )
}
```

### DateCell
```tsx
import { DateCell } from '@/components/common';

{
  key: 'createdAt',
  header: 'Created',
  cell: (value) => <DateCell value={value} format="relative" />
}
```

### CurrencyCell
```tsx
import { CurrencyCell } from '@/components/common';

{
  key: 'price',
  header: 'Price',
  cell: (value) => <CurrencyCell value={value} currency="USD" />
}
```

### AvatarCell
```tsx
import { AvatarCell } from '@/components/common';

{
  key: 'user',
  header: 'User',
  cell: (_, row) => (
    <AvatarCell 
      name={row.name} 
      email={row.email} 
      image={row.avatar} 
    />
  )
}
```

## Props Reference

### DataTableProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | Array of data objects |
| `columns` | `Column<T>[]` | - | Column configuration |
| `rowKey` | `keyof T \| ((row: T) => string)` | `'id'` | Unique row identifier |

#### Selection
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectable` | `boolean` | `false` | Enable row selection |
| `selectedRows` | `string[]` | `[]` | Controlled selected rows |
| `onSelectionChange` | `(rows: string[]) => void` | - | Selection change handler |

#### Sorting
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortable` | `boolean` | `true` | Enable sorting |
| `sortConfig` | `SortConfig` | - | Controlled sort state |
| `onSort` | `(key: string) => void` | - | Sort change handler |

#### Pagination
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pagination` | `boolean` | `true` | Enable pagination |
| `pageSize` | `number` | `10` | Items per page |
| `currentPage` | `number` | `1` | Current page |
| `totalItems` | `number` | - | Total items (for server-side) |
| `onPageChange` | `(page: number) => void` | - | Page change handler |
| `onPageSizeChange` | `(size: number) => void` | - | Page size change handler |

#### Search
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchable` | `boolean` | `true` | Enable search |
| `searchValue` | `string` | `''` | Controlled search value |
| `onSearchChange` | `(value: string) => void` | - | Search change handler |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |

#### Column Management
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columnSettings` | `boolean` | `true` | Enable column visibility toggle |
| `defaultVisibleColumns` | `string[]` | - | Initially visible columns |
| `onColumnVisibilityChange` | `(columns: string[]) => void` | - | Column visibility handler |

#### States
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `false` | Show loading state |
| `emptyMessage` | `string` | `'No data found'` | Empty state message |
| `loadingMessage` | `string` | `'Loading...'` | Loading state message |

#### Events
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRowClick` | `(row: T, index: number) => void` | - | Row click handler |

#### Styling
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Container CSS classes |
| `tableClassName` | `string` | - | Table CSS classes |
| `headerClassName` | `string` | - | Header CSS classes |
| `rowClassName` | `string \| ((row: T, index: number) => string)` | - | Row CSS classes |
| `cellClassName` | `string` | - | Cell CSS classes |

#### Custom Components
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customHeader` | `ReactNode` | - | Custom header content |
| `customFooter` | `ReactNode` | - | Custom footer content |

## Examples

See `DataTableExample.tsx` for comprehensive usage examples including:
- Basic table setup
- Custom cell renderers
- Row selection
- Sorting and pagination
- Search functionality
- Column management
- Sticky columns
- Action menus

## Styling

The component uses Tailwind CSS classes and follows the existing design system. You can customize the appearance using the various `className` props or by overriding the default styles.

## Accessibility

The component includes:
- Keyboard navigation
- Screen reader support
- ARIA labels and roles
- Focus management
- Semantic HTML structure

## Performance

- Efficient rendering with React.memo for cell components
- Virtualization support for large datasets (can be added)
- Optimized sorting and filtering algorithms
- Minimal re-renders with proper dependency arrays