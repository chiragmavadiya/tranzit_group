export type EnquiryStatus = 'Pending' | 'Resolved' | 'Closed';

export interface Enquiry {
  id: number;
  date: string;
  customer: string;
  issue_type: string;
  email: string;
  status: EnquiryStatus;
  message?: string;
  attachments?: any[];
}

export interface AdminInquiryResponse {
  status: boolean;
  message: string;
  data: Enquiry[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface AdminInquiryDetailResponse {
  status: boolean;
  message: string;
  data: Enquiry;
}
