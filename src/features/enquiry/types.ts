export type IssueCategory =
  | 'parcel'
  | 'sender'
  | 'feedback'
  | '';

export interface EnquiryFormData {
  issue_type: IssueCategory;
  reply_email: string;
  message: string;
  attachments: File[];
  nature_of_issue?: string;
  sender_role?: string;
  local_country?: string;
  contact_number?: string;
  feedback_category?: string;
}

export interface GenericOption {
  value: string;
  label: string;
}

export type CategoryOption = Omit<GenericOption, 'value'> & {
  value: IssueCategory;
}

export type ParcelEnquiryOption = GenericOption
export type SenderReceiverOption = GenericOption
export type CountryOption = GenericOption
export type FeedbackOption = GenericOption