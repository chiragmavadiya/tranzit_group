// interface Address {
//   id: number;
//   addressable_type: string;
//   addressable_id: number;
//   address_type: "sender" | "receiver";
//   parent_customer_id: number | null;
//   label: string;
//   address: string;
//   suburb: string;
//   postcode: string;
//   latitude: string | null;
//   longitude: string | null;
//   unit_number: string | null;
//   street_number: string | null;
//   street_name: string | null;
//   street_type: string | null;
//   state: string | null;
//   created_by: number | null;
//   updated_by: number | null;
//   created_at: string;
//   updated_at: string;
//   deleted_at: string | null;
// }

// interface SenderPayload {
//   name: string;
//   phone: string | null;
//   email: string;
//   company: string | null;
//   address1: string;
//   street_number: string;
//   street_name: string;
//   street_type: string | null;
//   address2: string | null;
//   suburb: string;
//   state: string;
//   postcode: string;
//   country: string;
//   label?: string;
// }

// interface ReceiverPayload {
//   name: string;
//   phone: string | null;
//   email: string | null;
//   company: string | null;
//   building?: string | null;
//   instructions?: string | null;
//   address1: string;
//   street_number: string | null;
//   street_name: string | null;
//   street_type: string | null;
//   address2: string | null;
//   suburb: string;
//   city?: string | null;
//   state: string;
//   postcode: string;
//   latitude?: string | null;
//   longitude?: string | null;
//   country: string;
//   label?: string | null
// }

// interface ExternalServices {
//   courier: string | number;
//   product_id: string | null;
//   product_type: string | null;
//   shipment_summary: string; // JSON string
//   cover_limited_liability: string | number;
//   signature_required?: string;
// }

// interface User {
//   id: number;
//   first_name: string;
//   last_name: string;
//   office_number: string | null;
//   email: string;
//   email_verified_at: string;
//   personal_email: string | null;
//   personal_mobile: string | null;
//   last_login_at: string;
//   last_login_ip: string | null;
//   stripe_customer_id: string | null;
//   status: string;
//   is_onboarded: boolean;
//   created_by: number | null;
//   updated_by: number | null;
//   created_at: string;
//   updated_at: string;
//   deleted_at: string | null;
// }
export interface Order {
  customer_name: string;
  order_number: string;
  suburb: string | null;
  amount: string | number;
  status: string;
  payment_status: string;
  courier: string;
  order_type: string;
  consignment_date: string;
}

// export type FilterType = 'include' | 'exclude';

// export interface FilterItem {
//   id: string;
//   category: string;
//   value: string;
//   type: FilterType;
// }

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

export interface AddressData {
  name: string;
  company: string;
  phone: string;
  email: string;
  address1?: string;
  address?: string;
  suburb: string;
  state: string;
  postcode: string;
  unit_number?: string;
  country: string;
  street_name: string;
  street_number: string;
  street_type?: string;
  saveToAddressBook: boolean;
}

export interface OrderFormData {
  receiverContactPerson: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverCompany: string;
  receiverBuilding: string;
  receiverInstructions: string;
  receiverStreetAddress: string;
  receiverStreetNumber: string;
  receiverStreetName: string;
  receiverStreetType: string;
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
  type?: 'sender' | 'receiver';
  initialData: AddressData;
  onSubmit: (type: "sender" | "receiver", data: AddressData) => void;
  isEdit: boolean;
}

export interface WalletCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
  orderTotal: number;
  onConfirm: () => void;
  isPending: boolean;
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
  type: string;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  item_id?: number | string;
  item_name?: string;
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
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}