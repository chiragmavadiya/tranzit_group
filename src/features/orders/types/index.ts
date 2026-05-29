export * from "./api.types";
export * from "./order-details.types";

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
  courier_logo?: string;
  product_id?: string;
  customer_full_address?: string;
  receiver_email?: string;
  receiver_phone?: string;
}

export type TabType = 'new' | 'printed' | 'shipped' | 'archived';

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
  email: string;
  phone: string;
  company: string;
  building: string;
  instructions: string;

  address1?: string;
  address?: string;
  street: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
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
  type?: 'sender' | 'receiver' | 'customer';
  initialData?: AddressData;
  onSubmit: (type: "sender" | "receiver" | "customer", data: AddressData) => void;
  isEdit: boolean;
  orderId?: string;
  isUpdate?: boolean;
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
  key: string;
  label: string;
  editable: boolean;
  type: 'select' | 'number' | 'text';
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
