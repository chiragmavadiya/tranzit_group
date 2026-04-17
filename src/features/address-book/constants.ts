import type { Address } from './types';

export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const AUSTRALIAN_STATES = [
  { key: 'New South Wales', value: 'NSW' },
  { key: 'Victoria', value: 'VIC' },
  { key: 'Queensland', value: 'QLD' },
  { key: 'Western Australia', value: 'WA' },
  { key: 'South Australia', value: 'SA' },
  { key: 'Tasmania', value: 'TAS' },
  { key: 'Australian Capital Territory', value: 'ACT' },
  { key: 'Northern Territory', value: 'NT' },
];

export const STREET_TYPES = [
  { key: 'Alley', value: 'ALLEY' },
  { key: 'Arcade', value: 'ARCADE' },
  { key: 'Avenue', value: 'AVE' },
  { key: 'Boulevard', value: 'BLVD' },
  { key: 'Circuit', value: 'CCT' },
  { key: 'Close', value: 'CL' },
  { key: 'Court', value: 'CT' },
  { key: 'Crescent', value: 'CRES' },
  { key: 'Drive', value: 'DR' },
  { key: 'Esplanade', value: 'ESP' },
  { key: 'Grove', value: 'GR' },
  { key: 'Highway', value: 'HWY' },
  { key: 'Lane', value: 'LANE' },
  { key: 'Mews', value: 'MEWS' },
  { key: 'Parade', value: 'PDE' },
  { key: 'Place', value: 'PL' },
  { key: 'Plaza', value: 'PLZA' },
  { key: 'Quay', value: 'QY' },
  { key: 'Ridge', value: 'RDGE' },
  { key: 'Road', value: 'RD' },
  { key: 'Square', value: 'SQ' },
  { key: 'Street', value: 'ST' },
  { key: 'Terrace', value: 'TCE' },
  { key: 'Way', value: 'WAY' },
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
