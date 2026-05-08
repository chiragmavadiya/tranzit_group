import { useState, useEffect } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import type { EnquiryStatus } from '../types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, Paperclip } from 'lucide-react';
import SelectComponent from '@/components/ui/select';
import { useAdminInquiryDetails, useUpdateInquiryStatus } from '@/features/enquiries/hooks/useEnquiries';
import { NavLink } from 'react-router-dom';

interface EnquiryDetailsDialogProps {
  enquiryId: number | undefined;
  onClose: () => void;
}

export function EnquiryDetailsDialog({ enquiryId, onClose }: EnquiryDetailsDialogProps) {
  const { data: detailsResponse, isLoading } = useAdminInquiryDetails(enquiryId || '');
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateInquiryStatus();
  const [currentStatus, setCurrentStatus] = useState<EnquiryStatus>('Pending');

  const enquiry = detailsResponse?.data;

  useEffect(() => {
    if (enquiry) {
      setCurrentStatus(enquiry.status);
    }
  }, [enquiry]);

  const handleUpdate = () => {
    if (enquiryId) {
      updateStatus({ id: enquiryId, status: currentStatus }, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  return (
    <CustomModel
      open={!!enquiryId}
      onOpenChange={(open) => !open && onClose()}
      title="Enquiry Details"
      onCancel={onClose}
      cancelText="Close"
      submitText="Update"
      onSubmit={handleUpdate}
      isLoading={isUpdating}
      contentClass="sm:max-w-[700px]"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500 font-medium italic">Loading details...</p>
        </div>
      ) : enquiry ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div className="space-y-1">
              <Label className="mb-0 text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Customer</Label>
              <p className="mb-1 mt-0 text-[13px] font-medium text-slate-500">{enquiry.customer}</p>
            </div>
            <div className="space-y-1">
              <Label className="mb-0 text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Email</Label>
              <p className="mb-1 mt-0 text-[13px] font-medium text-slate-500">{enquiry.email}</p>
            </div>
            <div className="space-y-1">
              <Label className="mb-0 text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Issue Type</Label>
              <p className="mb-1 mt-0 text-[13px] font-medium text-slate-500">{enquiry.issue_type}</p>
            </div>
            <div className="space-y-1">
              <Label className="mb-0 text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Date</Label>
              <p className="mb-1 mt-0 text-[13px] font-medium text-slate-500">{enquiry.date}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800" />

          <div className="space-y-2">
            <Label className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Message</Label>
            <div className="bg-[#e5e7eb] dark:bg-zinc-800 p-4 rounded-lg min-h-[60px]">
              <p className="text-[13px] text-slate-600 dark:text-zinc-300 font-medium whitespace-pre-wrap">
                {enquiry.message || "No message provided."}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Attachments</Label>
            {enquiry.attachments && enquiry.attachments.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {enquiry.attachments.map((file: any, index: number) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md hover:border-blue-300 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">File {index + 1}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400 font-medium italic">No attachments</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800">
            <NavLink
              // variant="outline"
              to={`mailto:${enquiry.email}`}>

              <Button
                variant="outline"
                className="bg-[#cbd5e1] hover:bg-[#b9c9d6] text-[#001c3d] font-bold h-10 px-4 border-none transition-all active:scale-95"
              // onClick={() => navigate(`mailto:${enquiry.email}`)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Reply to Customer
              </Button>
            </NavLink>

            <div className="flex items-center gap-4">
              <span className="text-[13px] font-medium text-slate-600">Change Status:</span>
              {/* <Select value={currentStatus} onValueChange={(val: EnquiryStatus) => setCurrentStatus(val || 'closed')}>
                <SelectTrigger className="w-[140px] h-10 border-slate-200 dark:border-zinc-800">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select> */}
              <SelectComponent
                data={[
                  {
                    label: 'Pending',
                    value: 'pending'
                  },
                  {
                    label: 'Resolved',
                    value: 'resolved'
                  },
                  {
                    label: 'Closed',
                    value: 'closed'
                  },
                ]}
                value={currentStatus}
                placeholder="Select Status"
                className="w-30 h-8 text-xs font-bold"
                onValueChange={(value: string | null) => setCurrentStatus(value as EnquiryStatus)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </CustomModel>
  );
}
