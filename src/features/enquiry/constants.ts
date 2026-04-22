import type { CategoryOption, CountryOption, FeedbackOption, ParcelEnquiryOption, SenderReceiverOption } from './types';

export const ISSUE_CATEGORIES: CategoryOption[] = [
  {
    label: 'Parcel enquiries',
    value: 'parcel',
  },
  {
    label: 'Sender and account enquiries',
    value: 'sender',
  },
  {
    label: 'Feedback',
    value: 'feedback',
  },

];

export const PARCEL_ENQUIRY_TYPE: ParcelEnquiryOption[] = [
  { value: 'status', label: 'Parcel Status/Tracking' },
  { value: 'damage', label: 'Damaged Parcel' },
  { value: 'missing', label: 'Missing Parcel' },
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

export const FEEDBACK_CATEGORIES: FeedbackOption[] = [
  { value: 'Website/Portal', label: 'Website/Portal' },
  { value: 'Service Quality', label: 'Service Quality' },
  { value: 'Driver/Courier', label: 'Driver/Courier' },
]

