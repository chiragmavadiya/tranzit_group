export interface QuoteLocation {
  label: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export interface QuoteItem {
  id?: string;
  type: string;
  qty?: number;
  quantity?: number;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface QuoteCalculations {
  totalItems: number;
  deadWeight: number;
  volumetricWeight: number;
  serviceCost: number;
  gst: number;
  surcharges: number;
  margin: number;
  total: number;
}

export interface ServiceRate {
  carrier: string;
  carrier_id: number;
  courierCode: string;
  service_code: string;
  code?: string;
  service_name: string;
  base: number;
  gst: number;
  withGST: number;
  customerQuotePrice: number;
  price: number;
  product_id: string;
  product_type: string;
  markup_charge: number;
  estimate_delivery_date: string;
  success: boolean;
  shipment_summary: string;
  image: string;
}

export interface QuoteSummary {
  id: number;
  quote_reference: string;
  email: string;
  sender_address: string;
  receiver_address: string;
  carrier: string;
  amount: number;
  created_at: string;
  created_by: string | null;
}

export interface QuoteDetails {
  quote_summary: {
    quote_reference: string;
    customer_email: string;
    service: string;
    total_amount: number;
    sent_by: string;
  };
  sender: {
    address: string;
  };
  receiver: {
    address: string;
  };
  item_details: QuoteItem[];
  margin_amount: number;
  margin_percent: number;
  pickup_charge: number;
  total_surcharge: number;
  surcharge_breakdown: any[];
}

export interface GetQuoteServicesPayload {
  sender_details: string; // postal_code|city|state
  receiver_details: string;
  receiver_address: string;
  items: QuoteItem[];
  is_order: "yes" | "no";
}

export interface CreateQuotePayload {
  sender: string;
  receiver: string;
  parcels: QuoteItem[];
  service: {
    courier: number;
    carrier_name: string;
    product_id: string;
    product_type: string;
  };
  surcharges: any[];
  chosenTotal: number;
  email: string;
  margin: number;
  pickup_charge: number;
}

export interface QuoteFilters {
  search?: string;
  page: number;
  per_page: number;
}

