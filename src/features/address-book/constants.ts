import type { Address } from './types';

export const AUSTRALIAN_STATES = [
  { label: 'New South Wales', value: 'NSW' },
  { label: 'Victoria', value: 'VIC' },
  { label: 'Queensland', value: 'QLD' },
  { label: 'Western Australia', value: 'WA' },
  { label: 'South Australia', value: 'SA' },
  { label: 'Tasmania', value: 'TAS' },
  { label: 'Australian Capital Territory', value: 'ACT' },
  { label: 'Northern Territory', value: 'NT' },
];

export const STREET_TYPES = [
  { label: 'Alley', value: 'ALLEY' },
  { label: 'Arcade', value: 'ARCADE' },
  { label: 'Avenue', value: 'AVE' },
  { label: 'Boulevard', value: 'BLVD' },
  { label: 'Circuit', value: 'CCT' },
  { label: 'Close', value: 'CL' },
  { label: 'Court', value: 'CT' },
  { label: 'Crescent', value: 'CRES' },
  { label: 'Drive', value: 'DR' },
  { label: 'Esplanade', value: 'ESP' },
  { label: 'Grove', value: 'GR' },
  { label: 'Highway', value: 'HWY' },
  { label: 'Lane', value: 'LANE' },
  { label: 'Mews', value: 'MEWS' },
  { label: 'Parade', value: 'PDE' },
  { label: 'Place', value: 'PL' },
  { label: 'Plaza', value: 'PLZA' },
  { label: 'Quay', value: 'QY' },
  { label: 'Ridge', value: 'RDGE' },
  { label: 'Road', value: 'RD' },
  { label: 'Square', value: 'SQ' },
  { label: 'Street', value: 'ST' },
  { label: 'Terrace', value: 'TCE' },
  { label: 'Way', value: 'WAY' },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    "id": 1,
    "code": "101",
    "customer_id": 2,
    "contact_person": "Test",
    "business_name": "Test",
    "phone": "0477445588",
    "email": "shikharchksh3@gmail.com",
    "created_at": "2025-12-30T09:37:43.000000Z",
    "address": "120 Collins Street, Melbourne VIC, Australia",
    "DT_RowIndex": 1
  },
  {
    "id": 4,
    "code": "",
    "customer_id": 2,
    "contact_person": "test 123",
    "business_name": "Business123",
    "phone": "0416735272",
    "email": "darshilchksh@gmail.com",
    "created_at": "2026-01-16T23:24:24.000000Z",
    "address": "12 Seuss Drive, Officer VIC, Australia",
    "DT_RowIndex": 2
  }
];
