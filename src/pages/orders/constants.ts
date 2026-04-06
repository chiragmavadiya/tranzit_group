import type { MOCK_DATA_TYPE, Order, TabType } from './types';

export const TABS: TabType[] = ['New', 'Printed', 'Shipped', 'Archived'];

export const ORDER_TYPES = ['All Types', 'Marketplace', 'Manual', 'Integration'];
export const STATUSES = ['All Statuses', 'New', 'Printed', 'Shipped', 'Archived'];

export const COLUMN_CONFIG = [
  { header: 'Customer Name', key: 'customer', className: 'font-medium' },
  { header: 'Order ID', key: 'id_display', className: 'font-bold text-blue-600' },
  { header: 'Suburb', key: 'Suburb' },
  { header: 'Amount', key: 'Amount' },
  { header: 'Status', key: 'status' },
  { header: 'Payment Status', key: 'Payment_Status' },
  { header: 'Courier', key: 'Courier' },
  { header: 'Order Type', key: 'Order_Type' },

  // { header: 'Date', key: 'date', className: 'text-gray-500' },
  // { header: 'Type', key: 'type' },
  // { header: 'Status', key: 'status' },
  // { header: 'Total', key: 'total', className: 'text-right font-semibold' },
  // { header: 'Bin location', key: 'bin_location' },
  // { header: 'Carrier & product', key: 'carrier_product' },
  // { header: 'Company name', key: 'company_name' },
  // { header: 'Country', key: 'country' },
  // { header: 'Description', key: 'description' },
  // { header: 'Item QTY', key: 'item_qty' },
  // { header: 'Item total', key: 'item_total' },
  // { header: 'Item(s)', key: 'items' },
  // { header: 'Method', key: 'method' },
  // { header: 'Notes', key: 'notes' },
  // { header: 'Packaging', key: 'packaging' },
  // { header: 'Print button', key: 'print_button' },
  // { header: 'Reference', key: 'reference' },
  // { header: 'Shipping paid', key: 'shipping_paid' },
  // { header: 'SKU(s)', key: 'skus' },
  // { header: 'Source', key: 'source' },
  // { header: 'State', key: 'state' },
  // { header: 'Tags', key: 'tags' },
  // { header: 'Weight', key: 'weight' },
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

export const MOCK_DATA: MOCK_DATA_TYPE[] = [
  {
    "customer": "Chirag 10 Gondaliya 10",
    "id_display": "#01KGP2QZ287MCPKMJ2ZPDCPQAJ PO10005226",
    "Suburb": "Chester Hill",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Courier Not Assigned",
    "Courier": "-",
    "Order_Type": "Import"
  },
  {
    "customer": "Chirag 10 Gondaliya 10",
    "id_display": "#01KG54GMY0XESJMZXCGY0QJBM8",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Paid",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Chirag 10 Gondaliya 10",
    "id_display": "#01KDSH0S45K5AAYNK0K7FPV9HR PO1000",
    "Suburb": "Chester Hill",
    "Amount": "-",
    "status": "Payment Pending",
    "Payment_Status": "Courier Not Assigned",
    "Courier": "-",
    "Order_Type": "Import"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5P7QH5ZYX46WW0CF1HAE 11866348224877",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5P5PPFZ0WCJNG9N3R6Y1 11866349109613",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5P3737Z5N0Q8PV2F67NY 11866349863277",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5P1W1VQ4WQ3CMN2MCXSG 11866363363693",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5P0MVSXBSSN7FRBVAWK9 11866364150125",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5NYPVEPACKZTRQQDH38W 11866372309357",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5NX98D26R48YQ3SAWTCT 11866435617133",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5NW0M36JNN7X755XZQXC 11866437353837",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYJ5NR4T486AT2N6JGF252G 11867771634029",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDYH07KPVD9FW9ERDK0EY5BT 11869015900525",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDSWJZPJZ2FAATG2W364X6X4 11866440532333",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDSWB0EPXCDR6AYYV1BMS07T 11866437976429",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#01KDSWAXP09P0ZVPJQQ2N1CGEE 11866437976429",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11866343604589 #1122",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11866332627309 #1118",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11866334134637 #1119",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11866335379821 #1120",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11866338296173 #1121",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11865108021613 #1117",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11865106022765 #1116",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11865104941421 #1115",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11865098420589 #1114",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11863764402541 #1113",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11863712432493 #1112",
    "Suburb": "Melbourne",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11848930525549 #1103",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11848935276909 #1104",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11848941535597 #1105",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11863616061805 #1106",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11863617601901 #1107",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11863629496685 #1108",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11863632773485 #1109",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11863634051437 #1110",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#11863703716205 #1111",
    "Suburb": "a",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Shopify"
  },
  {
    "customer": "Customer1 User",
    "id_display": "#9K3AR88NG1",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer2 User",
    "id_display": "#K3C5XMWKZX",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer2 User",
    "id_display": "#YQC01D4JMP",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer2 User",
    "id_display": "#5OIAPHJBFQ",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer2 User",
    "id_display": "#PUYANV6DX3",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGRNWYDMA102QYY111SVHM 79",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGJQQ3VVVECT0BHCC1ZG71 78",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3P4S4FAXQR65ZPQKAV9 64",
    "Suburb": "Berwick",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3NG6XYNVT17JTXR36FH 65",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3M6MNG0PTV9PRVADK58 66",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3KK18BZF160TTXRQA50 67",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3JZVRMNMPYY3HDNK370 68",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3J84RJZHX2A48RHCA3B 69",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3HJXMCS790BPDHHM0AX 70",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3GPWCTVT5DNQW4TSP63 71",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3G0XAKJKFCEC6AHQNKA 72",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3F4MP86AX2FYXP7J23W 73",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGE3C58VEPB3M4BWWGSEFT 74",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#01KFFGD8RW8YYEEXBAE7YZE2BB 77",
    "Suburb": "Abc",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Payment Pending",
    "Courier": "-",
    "Order_Type": "Woocommerce"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#TEUWQTYOIM",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer3sf User",
    "id_display": "#F4PQT3E250",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer4 User",
    "id_display": "#3VOMQPFGEV",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer4 User",
    "id_display": "#V4CKCFQO8Q",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Customer4 User",
    "id_display": "#XGELMRUMAD",
    "Suburb": "-",
    "Amount": "-",
    "status": "Courier Not Assigned",
    "Payment_Status": "Paid",
    "Courier": "-",
    "Order_Type": "Manual"
  },
  {
    "customer": "Shikhar Test",
    "id_display": "#PO1000",
    "Suburb": "Chester Hill",
    "Amount": "$16.30",
    "status": "Payment Pending",
    "Payment_Status": "Payment Pending",
    "Courier": "Auspost",
    "Order_Type": "Manual"
  }
]

export const Order_status_styles: Record<string, string> = {
  New: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Printed: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Shipped: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Archived: 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700',
  'Courier Not Assigned': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  'Payment Pending': 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-300 border-orange-500 dark:border-orange-800',
  'Paid': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
};

