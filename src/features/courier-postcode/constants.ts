import type { GenericOption } from '../enquiry/types';
import type { CourierPostcode } from './types';

export const MOCK_POSTCODES: CourierPostcode[] = [
  { id: '1', courierName: 'Direct Freight Express Tranzit Group', postCode: '4850', price: '69.00' },
  { id: '2', courierName: 'Direct Freight Express Tranzit Group', postCode: '4882', price: '82.00' },
  { id: '3', courierName: 'Direct Freight Express Tranzit Group', postCode: '3714', price: '46.00' },
  { id: '4', courierName: 'Direct Freight Express Tranzit Group', postCode: '4474', price: '46.00' },
  { id: '5', courierName: 'Direct Freight Express Tranzit Group', postCode: '848', price: '115.00' },
  { id: '6', courierName: 'Direct Freight Express Tranzit Group', postCode: '7150', price: '82.00' },
];

export const COURIER_OPTIONS: GenericOption[] = [
  { label: 'Direct Freight Express Tranzit Group', value: 'direct_freight' },
  { label: 'StarTrack', value: 'startrack' },
  { label: 'Australia Post', value: 'auspost' },
];
