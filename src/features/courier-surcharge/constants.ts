import type { GenericOption } from '../enquiry/types';
import type { CourierSurcharge } from './types';

export const MOCK_SURCHARGES: CourierSurcharge[] = [
  {
    id: '1',
    courierName: 'Direct Freight Express Tranzit Group',
    code: 'palletising',
    name: 'Palletising',
    description: 'Charge for palletising loose freight.',
    amount: '25.00',
    customerSelectable: true,
    autoApply: false,
    chargeBasis: 'per_consignment',
    appliesOn: 'pickup',
    defaultSelected: false
  },
  {
    id: '2',
    courierName: 'Direct Freight Express Tranzit Group',
    code: 'airport_delivery_surcharge',
    name: 'Airport Delivery Surcharge',
    description: 'Additional charge for airport deliveries.',
    amount: '25.00',
    customerSelectable: true,
    autoApply: false,
    chargeBasis: 'per_consignment',
    appliesOn: 'delivery',
    defaultSelected: false
  },
  {
    id: '3',
    courierName: 'Direct Freight Express Tranzit Group',
    code: 'exhibition_centre_surcharge',
    name: 'Exhibition Centre Surcharge',
    description: 'Per consignment note (per Delivery / Pickup).',
    amount: '200.00',
    customerSelectable: true,
    autoApply: false,
    chargeBasis: 'per_consignment',
    appliesOn: 'both',
    defaultSelected: false
  },
  {
    id: '4',
    courierName: 'Direct Freight Express Tranzit Group',
    code: 'hand_unload',
    name: 'Hand Unload',
    description: 'Per pallet/skid/crate.',
    amount: '35.00',
    customerSelectable: false,
    autoApply: false,
    chargeBasis: 'per_pallet',
    appliesOn: 'both',
    defaultSelected: false
  }
];

export const COURIER_OPTIONS: GenericOption[] = [
  { label: 'Direct Freight Express Tranzit Group', value: 'direct_freight' },
  { label: 'StarTrack', value: 'startrack' },
  { label: 'Australia Post', value: 'auspost' },
];

export const CHARGE_BASIS_OPTIONS: GenericOption[] = [
  { label: 'Per Consignment', value: 'per_consignment' },
  { label: 'Per Pallet', value: 'per_pallet' },
  { label: 'Per KG', value: 'per_kg' },
];

export const APPLIES_ON_OPTIONS: GenericOption[] = [
  { label: 'Pickup', value: 'pickup' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'Both', value: 'both' },
];

export const YES_NO_OPTIONS: GenericOption[] = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
];
