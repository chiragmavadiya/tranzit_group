import type { Address } from './types';

export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    code: 'ADDR001',
    contact_person: 'John Doe',
    business_name: 'Tech Corp',
    email_id: 'john@techcorp.com',
    mobile: '+1 234 567 8900',
    address: '123 Tech Lane, Silicon Valley, CA',
    is_active: 1,
    DT_RowIndex: 1
  },
  {
    id: 2,
    code: 'ADDR002',
    contact_person: 'Jane Smith',
    business_name: 'Design Studio',
    email_id: 'jane@designstudio.com',
    mobile: '+1 987 654 3210',
    address: '456 Creative Ave, New York, NY',
    is_active: 1,
    DT_RowIndex: 2
  },
  {
    id: 3,
    code: 'ADDR003',
    contact_person: 'Mike Johnson',
    business_name: 'Logistics Plus',
    email_id: 'mike@logisticsplus.com',
    mobile: '+1 555 123 4567',
    address: '789 Warehouse Way, Chicago, IL',
    is_active: 1,
    DT_RowIndex: 3
  }
];
