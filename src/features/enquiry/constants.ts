import type { CategoryOption, ParcelEnquiryOption } from './types';

export const ISSUE_CATEGORIES: CategoryOption[] = [
  {
    label: 'Parcel enquiries',
    value: 'parcel_enquiry',
  },
  {
    label: 'Sender and account enquiries',
    value: 'sender_and_account_enquiry',
  },
  {
    label: 'Feedback',
    value: 'feedback',
  },

];

export const PARCEL_ENQUIRY_TYPE: ParcelEnquiryOption[] = [
  { value: 'parcel_status_tracking', label: 'Parcel Status/Tracking' },
  { value: 'damaged_parcel', label: 'Damaged Parcel' },
  { value: 'missing_parcel', label: 'Missing Parcel' },
  { value: 'other', label: 'Other' },
] 
