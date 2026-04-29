import type { GenericOption } from '../enquiry/types';

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
