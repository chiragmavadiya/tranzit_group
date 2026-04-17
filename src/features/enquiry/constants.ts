import type { CategoryOption, CountryOption, ParcelEnquiryOption, SenderReceiverOption } from './types';

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
export const COUNTRY: CountryOption[] = [
  { value: 'Australia', label: 'Australia' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'other', label: 'Other' },
]

export const SENDER_RECEIVER: SenderReceiverOption[] = [
  { value: 'sender', label: 'Sender' },
  { value: 'receiver', label: 'Receiver' },
]

