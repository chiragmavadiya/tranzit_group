export interface QuoteLocation {
  label: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export interface QuoteItem {
  id: string;
  type: 'Parcel' | 'Document' | 'Pallet';
  qty: number;
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
  id: string;
  provider: string;
  name: string;
  logo?: string;
  price: number;
  estimatedDays: string;
  carrierLogo?: string;
}
