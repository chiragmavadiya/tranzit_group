interface Address {
  id: number;
  addressable_type: string;
  addressable_id: number;
  address_type: "sender" | "receiver";
  parent_customer_id: number | null;
  label: string;
  address: string;
  suburb: string;
  postcode: string;
  latitude: string | null;
  longitude: string | null;
  unit_number: string | null;
  street_number: string | null;
  street_name: string | null;
  street_type: string | null;
  state: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface SenderPayload {
  name: string;
  phone: string | null;
  email: string;
  company: string | null;
  address1: string;
  street_number: string;
  street_name: string;
  street_type: string | null;
  address2: string | null;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  label?: string;
}

interface ReceiverPayload {
  name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  building?: string | null;
  instructions?: string | null;
  address1: string;
  street_number: string | null;
  street_name: string | null;
  street_type: string | null;
  address2: string | null;
  suburb: string;
  city?: string | null;
  state: string;
  postcode: string;
  latitude?: string | null;
  longitude?: string | null;
  country: string;
  label?: string | null
}

interface ExternalServices {
  courier: string | number;
  product_id: string | null;
  product_type: string | null;
  shipment_summary: string; // JSON string
  cover_limited_liability: string | number;
  signature_required?: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  office_number: string | null;
  email: string;
  email_verified_at: string;
  personal_email: string | null;
  personal_mobile: string | null;
  last_login_at: string;
  last_login_ip: string | null;
  stripe_customer_id: string | null;
  status: string;
  is_onboarded: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  external_order_number: string | null;
  external_created_at: string | null;
  sender_payload: SenderPayload | null;
  receiver_payload: ReceiverPayload | null;
  subtotal: string;
  tax: string;
  surcharge_payload: unknown[] | null;
  surcharge_amount: string;
  fuel_levy: string;
  courier_actual_charge: string;
  extra_service_charge: string;
  external_services: ExternalServices | null;
  markup_value: string;
  total_amount: string;
  amount: string | null;
  paid_amount: string;
  balance_due: string;
  markup_charge: string | null;
  status: number;
  source: string;
  courier: number;
  is_own_courier: number;
  order_payment_status: number;
  book: number;
  book_date: string | null;
  courier_name: string | null;
  tracking_number: string | null;
  label_url: string | null;
  total_weight: number | null;
  total_cubic_weight: number | null;
  is_consigned: boolean;
  additional_notes: string | null;
  label_notes: string | null;
  client_request_id: string | null;
  payment_type: string | null;
  courier_payload: string | null;       // JSON string
  tracking_payload: string | null;      // JSON string
  aust_post_product_type: string | null;
  aust_post_product_id: string | null;
  tracking_status: string | null;
  auspost_order_id: string | null;
  auspost_order_payload: string | null; // JSON string
  shipment_summary: string | null;      // JSON string
  shopify_store_id: string | null | number;
  external_order_id: string | null;
  cover_limited_liability: string | null;
  signature_required: string | null;
  delivery_instructions: string | null;
  pickup_date: string | null;
  created_at: string;
  updated_at: string;
  raw_payload: unknown | null;
  user: User;
  addresses: Address[];
  raw_source: number;
  DT_RowIndex: number;
  bin_location?: string;
  carrier_product?: string;
  description?: string;
  item_qty?: number;
  item_total?: number | string;
  items?: string;
  method?: string;
  notes?: string;
  packaging?: string;
  print_button?: boolean;
  reference?: string;
  shipping_paid?: number | string;
  skus?: string;
  tags?: string[];
  weight?: string | number;
}

export type FilterType = 'include' | 'exclude';

export interface FilterItem {
  id: string;
  category: string;
  value: string;
  type: FilterType;
}

export type TabType = 'New' | 'Printed' | 'Shipped' | 'Archived';

// ------------------------- CREATE ORDERS ----------------------------------//

export interface Packet {
  id: string;
  itemType: string;
  quantity: string;
  weight: string;
  length: string;
  width: string;
  height: string;
}

export interface OrderFormData {
  receiverContactPerson: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverCompany: string;
  receiverBuilding: string;
  receiverInstructions: string;
  receiverStreetAddress: string;
  receiverTownSuburb: string;
  receiverCity: string;
  receiverState: string;
  receiverPostcode: string;
  receiverCountry: string;
  saveToAddressBook: boolean;
  packets: Packet[];
}

export interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'order' | 'return' | 'sender' | 'receiver';
}

export interface PackingColumn {
  key: string
  label: string
  editable: boolean
  type: 'select' | 'number' | 'text'
  displayTotal?: boolean;
}
export interface PackagingData {
  package: string;
  qty: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  cubic: number;
  tracking: string;
  [key: string]: string | number;
}

export interface ItemData {
  item: string;
  sku: string;
  ship: number;
  unitPrice: number;
  weight: number;
  size: string;
  countryOfOrigin: string;
  qtyShipped: number;
  color?: string;
  currency?: string;
  qtyOrdered?: number;
  binLocation?: string;
  barcode?: string;
  hsCode?: string;
  material?: string;
  manufacturerId?: string;
  brandName?: string;
  makeOrModel?: string;
  usageOrPurpose?: string;
  [key: string]: string | number | undefined | null;
}

export interface ItemsColumn extends PackingColumn {
  default?: boolean;
}

export interface ColumnConfig {
  header: string;
  key: string;
  className?: string;
  default?: boolean;
}

export interface OrdersResponse {
  status: boolean;
  message: string;
  data: Order[];
}