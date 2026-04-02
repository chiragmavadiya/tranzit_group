export interface Order {
  id: string;
  id_display: string;
  date: string;
  customer: string;
  company_name: string;
  country: string;
  state: string;
  type: 'Marketplace' | 'Manual' | 'Integration';
  status: 'New' | 'Printed' | 'Shipped' | 'Archived';
  total: number;
  items_count: number;
  bin_location: string;
  carrier_product: string;
  description: string;
  item_qty: number;
  item_total: number;
  items: string;
  method: string;
  notes: string;
  packaging: string;
  print_button: boolean;
  reference: string;
  shipping_paid: number;
  skus: string;
  source: string;
  tags: string[];
  weight: string;
}

export type TabType = 'New' | 'Printed' | 'Shipped' | 'Archived';
