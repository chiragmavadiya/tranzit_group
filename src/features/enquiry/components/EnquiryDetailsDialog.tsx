import { CustomModel } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Paperclip } from 'lucide-react';
import type { EnquiryStatus } from '@/features/enquiries/types';
import { ENQUIRY_STATUS_CONFIG } from '@/features/enquiries/constant';
import { cn } from '@/lib/utils';

interface EnquiryDetailsDialogProps {
  enquiry: any | null;
  onClose: () => void;
}

export function EnquiryDetailsDialog({ enquiry, onClose }: EnquiryDetailsDialogProps) {
  if (!enquiry) return null;

  const status = (enquiry.status || 'pending').toLowerCase() as EnquiryStatus;
  const statusConfig = ENQUIRY_STATUS_CONFIG[status];

  return (
    <CustomModel
      open={!!enquiry}
      onOpenChange={(open) => !open && onClose()}
      title="Enquiry Details"
      onCancel={onClose}
      cancelText="Close"
      contentClass="sm:max-w-[600px]"
    >
      <div className="flex flex-col gap-6 text-slate-800 dark:text-zinc-100">
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-xs">
          <div className="space-y-1">
            <Label className="mb-0 text-[11px] font-extrabold uppercase text-slate-500 dark:text-zinc-400 tracking-wide">
              Issue Type
            </Label>
            <p className="mb-1 mt-0 text-[13px] font-semibold capitalize text-slate-700 dark:text-zinc-200">
              {enquiry.issue_type}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="mb-0 text-[11px] font-extrabold uppercase text-slate-500 dark:text-zinc-400 tracking-wide">
              Reply Email
            </Label>
            <p className="mb-1 mt-0 text-[13px] font-medium text-slate-700 dark:text-zinc-200">
              {enquiry.email || enquiry.reply_email || ''}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="mb-0 text-[11px] font-extrabold uppercase text-slate-500 dark:text-zinc-400 tracking-wide">
              Status
            </Label>
            <div>
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border transition-all",
                statusConfig?.className || 'bg-gray-50 text-gray-600'
              )}>
                {enquiry.status || 'Pending'}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="mb-0 text-[11px] font-extrabold uppercase text-slate-500 dark:text-zinc-400 tracking-wide">
              Date
            </Label>
            <p className="mb-1 mt-0 text-[13px] font-medium text-slate-700 dark:text-zinc-200">
              {enquiry.date || enquiry.created_at || ''}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-zinc-800" />

        <div className="space-y-2 text-xs">
          <Label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-zinc-400 tracking-wide">
            Message
          </Label>
          <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-xl min-h-[80px]">
            <p className="text-[13px] text-slate-600 dark:text-zinc-300 font-medium whitespace-pre-wrap leading-relaxed">
              {enquiry.message || "No message provided."}
            </p>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <Label className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-zinc-400 tracking-wide">
            Attachments
          </Label>
          {enquiry.attachments && enquiry.attachments.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {enquiry.attachments.map((file: any, index: number) => {
                const fileUrl = typeof file === 'string' ? file : file.url;
                const fileName = typeof file === 'string'
                  ? file.split('/').pop()
                  : (file.name || `File ${index + 1}`);

                return (
                  <a
                    key={index}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md hover:border-blue-300 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 truncate max-w-[150px]">
                      {fileName}
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-slate-400 font-medium">No attachments</p>
          )}
        </div>
      </div>
    </CustomModel>
  );
}
