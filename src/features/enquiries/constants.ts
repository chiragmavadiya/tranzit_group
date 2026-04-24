import type { Enquiry } from './types';

export const MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: '1',
    date: '05 Feb 2026, 03:58 PM',
    customer: 'Chirag 10 Gondaliya 10',
    issueType: 'Parcel',
    email: 'chirag.magecurious@gmail.com',
    status: 'pending',
    message: 'I am facing issues with my parcel delivery. Please check the status.'
  },
  {
    id: '2',
    date: '04 Feb 2026, 11:20 AM',
    customer: 'Rahul Sharma',
    issueType: 'Payment',
    email: 'rahul.s@example.com',
    status: 'resolved',
    message: 'Payment was deducted twice for the same order.'
  },
  {
    id: '3',
    date: '03 Feb 2026, 09:15 AM',
    customer: 'Sneha Patel',
    issueType: 'Address',
    email: 'sneha.p@test.com',
    status: 'in_progress',
    message: 'Need to update the delivery address for order #TRZ-9921.'
  }
];
