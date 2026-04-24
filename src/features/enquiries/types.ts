export type EnquiryStatus = 'pending' | 'resolved' | 'in_progress';

export interface Enquiry {
  id: string;
  date: string;
  customer: string;
  issueType: string;
  email: string;
  status: EnquiryStatus;
  message?: string;
}
