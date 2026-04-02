import type { Order, TabType } from './types';

export const TABS: TabType[] = ['New', 'Printed', 'Shipped', 'Archived'];

export const ORDER_TYPES = ['All Types', 'Marketplace', 'Manual', 'Integration'];
export const STATUSES = ['All Statuses', 'New', 'Printed', 'Shipped', 'Archived'];

export const COLUMN_CONFIG = [
  { header: 'Order ID', key: 'id_display', className: 'font-bold text-blue-600' },
  { header: 'Date', key: 'date', className: 'text-gray-500' },
  { header: 'Customer', key: 'customer', className: 'font-medium' },
  { header: 'Type', key: 'type' },
  { header: 'Status', key: 'status' },
  { header: 'Total', key: 'total', className: 'text-right font-semibold' },
  { header: 'Bin location', key: 'bin_location' },
  { header: 'Carrier & product', key: 'carrier_product' },
  { header: 'Company name', key: 'company_name' },
  { header: 'Country', key: 'country' },
  { header: 'Description', key: 'description' },
  { header: 'Item QTY', key: 'item_qty' },
  { header: 'Item total', key: 'item_total' },
  { header: 'Item(s)', key: 'items' },
  { header: 'Method', key: 'method' },
  { header: 'Notes', key: 'notes' },
  { header: 'Packaging', key: 'packaging' },
  { header: 'Print button', key: 'print_button' },
  { header: 'Reference', key: 'reference' },
  { header: 'Shipping paid', key: 'shipping_paid' },
  { header: 'SKU(s)', key: 'skus' },
  { header: 'Source', key: 'source' },
  { header: 'State', key: 'state' },
  { header: 'Tags', key: 'tags' },
  { header: 'Weight', key: 'weight' },
];

const CUSTOMER_NAMES = [
  'John Smith', 'Sarah Johnson', 'Arun Kumar', 'Emma Wilson', 'Michael Chen',
  'Elena Rodriguez', 'David O\'Connor', 'Sophie Taylor', 'Ken Tanaka', 'Lisa Brown',
  'Tom Hardy', 'Grace Lee', 'Jack Miller', 'Olivia White', 'Ryan Gosling',
  'Anna Muller', 'Lucas Silva', 'Yuki Sato', 'Isabella Garcia', 'Mohammed Ali'
];

export const MOCK_ORDERS: Order[] = Array.from({ length: 1000 }, (_, i) => {
  const types: Order['type'][] = ['Marketplace', 'Manual', 'Integration'];
  const statuses: Order['status'][] = ['New', 'Printed', 'Shipped', 'Archived'];
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  return {
    id: (i + 1).toString(),
    id_display: `#ORD-${7241 + i}`,
    date: date.toISOString().split('T')[0],
    customer: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length] + (i > CUSTOMER_NAMES.length ? ` ${Math.floor(i / CUSTOMER_NAMES.length)}` : ''),
    company_name: 'Tranzit Group',
    country: 'United Kingdom',
    state: 'London',
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    total: parseFloat((Math.random() * 1500 + 10).toFixed(2)),
    items_count: Math.floor(Math.random() * 12) + 1,
    bin_location: `BIN-${Math.floor(Math.random() * 100)}`,
    carrier_product: 'Royal Mail 24',
    description: 'Order description goes here',
    item_qty: Math.floor(Math.random() * 10) + 1,
    item_total: parseFloat((Math.random() * 500 + 5).toFixed(2)),
    items: 'Product A, Product B',
    method: 'Standard Shipping',
    notes: 'Please leave at the door',
    packaging: 'Large Box',
    print_button: Math.random() > 0.5,
    reference: `REF-${Math.floor(Math.random() * 10000)}`,
    shipping_paid: parseFloat((Math.random() * 20 + 2).toFixed(2)),
    skus: 'SKU001, SKU002',
    source: 'Shopify',
    tags: ['Urgent', 'Fragile'],
    weight: `${(Math.random() * 5 + 0.5).toFixed(2)} kg`,
  };
});

