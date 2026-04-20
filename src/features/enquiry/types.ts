export type IssueCategory =
  | 'parcel_enquiry'
  | 'sender_and_account_enquiry'
  | 'feedback'
  | '';

export interface EnquiryFormData {
  category: IssueCategory;
  email: string;
  message: string;
  attachments: File[];
  nature_of_issue?: string;
  sender_receiver?: string;
  local_country?: string;
  phone_number?: string;
}

export interface CategoryOption {
  value: IssueCategory;
  label: string;
}

export interface ParcelEnquiryOption {
  value: string,
  label: string,
}

export interface SenderReceiverOption {
  value: string;
  label: string;
}
export interface CountryOption {
  value: string;
  label: string;
}