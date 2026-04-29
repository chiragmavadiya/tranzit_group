import { useState, useEffect } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import type { Enquiry, EnquiryStatus } from '../types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnquiryDetailsDialogProps {
  enquiry: Enquiry | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: EnquiryStatus) => void;
}

export function EnquiryDetailsDialog({ enquiry, onClose, onUpdateStatus }: EnquiryDetailsDialogProps) {
  const [currentStatus, setCurrentStatus] = useState<EnquiryStatus>('pending');

  useEffect(() => {
    if (enquiry) {
      setCurrentStatus(enquiry.status);
    }
  }, [enquiry]);

  const handleUpdate = () => {
    if (enquiry && onUpdateStatus) {
      onUpdateStatus(enquiry.id, currentStatus);
    }
    onClose();
  };

  return (
    <CustomModel
      open={!!enquiry}
      onOpenChange={(open) => !open && onClose()}
      title="Enquiry Details"
      onCancel={onClose}
      cancelText="Close"
      submitText="Update"
      onSubmit={handleUpdate}
      // hideSubmit={true}
      contentClass="sm:max-w-[700px]"
    >
      {enquiry && (
        <div className="flex flex-col gap-6 py-2">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-1">
              <Label className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Customer</Label>
              <p className="text-[13px] font-medium text-slate-500">{enquiry.customer}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Email</Label>
              <p className="text-[13px] font-medium text-slate-500">{enquiry.email}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Issue Type</Label>
              <p className="text-[13px] font-medium text-slate-500">{enquiry.issueType}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Date</Label>
              <p className="text-[13px] font-medium text-slate-500">{enquiry.date}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 my-2" />

          <div className="space-y-2">
            <Label className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Message</Label>
            <div className="bg-[#e5e7eb] dark:bg-zinc-800 p-4 rounded-lg min-h-[60px]">
              <p className="text-[13px] text-slate-600 dark:text-zinc-300 font-medium">
                {enquiry.message || "No message provided."}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">Attachments</Label>
            <p className="text-[13px] text-slate-400 font-medium italic">No attachments</p>
          </div>

          <div className="absolute bottom-5 w-[480px] flex items-center justify-between pt-6 mt-4 border-t border-slate-100 dark:border-zinc-800">
            <Button
              variant="outline"
              className="bg-[#cbd5e1] hover:bg-[#b9c9d6] text-[#001c3d] font-bold h-10 px-4 border-none transition-all active:scale-95"
              onClick={() => window.open(`mailto:${enquiry.email}`)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Reply to Customer
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-[13px] font-medium text-slate-600">Change Status:</span>
              <Select value={currentStatus} onValueChange={(val: string | null) => setCurrentStatus((val as EnquiryStatus) || 'pending')}>
                <SelectTrigger className="w-[140px] h-10 border-slate-200 dark:border-zinc-800">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </CustomModel>
  );
}
