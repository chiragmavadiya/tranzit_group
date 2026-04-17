import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from './FileUpload';
import { ISSUE_CATEGORIES, PARCEL_ENQUIRY_TYPE } from '../constants';
import type { EnquiryFormData, IssueCategory } from '../types';
import { Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI';

export function EnquiryForm() {
  const [formData, setFormData] = useState<EnquiryFormData>({
    category: 'parcel_enquiry',
    email: '',
    subject: '',
    message: '',
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Your enquiry has been submitted successfully');
  };

  const updateFiles = useCallback((files: File[]) => {
    setFormData(prev => ({ ...prev, attachments: files }));
  }, []);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6 text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
          Thank you for reaching out!
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 max-w-sm mb-8">
          Your enquiry has been received. Our support team will get back to you at <strong>{formData.email}</strong> as soon as possible.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
          className="rounded-full px-8"
        >
          Send another enquiry
        </Button>
      </div>
    );
  }
  console.log(formData)
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <FormSelect
            label='Issue Category'
            placeholder='Select enquiry'
            value={formData?.category || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: (value || 'parcel_enquiry') as IssueCategory }))}
            className="h-10 border-gray-200 dark:border-zinc-800"
            required
            options={ISSUE_CATEGORIES}
          />
        </div>

        <div className="space-y-2">
          <FormInput
            label='Reply Email'
            type='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
            className="h-10 border-gray-200 dark:border-zinc-800"
            required
          />
        </div>

        {formData.category === 'sender_and_account_enquiry' && (
          <div className="space-y-2">
            <FormSelect
              label="I'm the sender/receiver"
              placeholder='Select your role'
              value={formData?.sender_receiver || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, sender_receiver: value || '' }))}
              className="h-10 border-gray-200 dark:border-zinc-800"
              required
              options={PARCEL_ENQUIRY_TYPE}
            />
          </div>
        )}
        {formData.category === 'parcel_enquiry' && (
          <>
            <div className="space-y-2">
              <FormSelect
                label='Nature of Issue'
                placeholder='Select nature of issue'
                value={formData?.nature_of_issue || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, nature_of_issue: value || '' }))}
                className="h-10 border-gray-200 dark:border-zinc-800"
                required
                options={PARCEL_ENQUIRY_TYPE}
              />
            </div>
            <div className="space-y-2">
              <FormSelect
                label='Nature of Issue'
                placeholder='Select nature of issue'
                value={formData?.nature_of_issue || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, nature_of_issue: value || '' }))}
                className="h-10 border-gray-200 dark:border-zinc-800"
                required
                options={PARCEL_ENQUIRY_TYPE}
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700 dark:text-zinc-300">
          How can we help? <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Please describe your issue in detail..."
          // className="min-h-[150px] border-gray-200 dark:border-zinc-800 resize-none px-4 py-3"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          required
        />
        <p className="text-[11px] text-gray-400 dark:text-zinc-500">
          A member of support staff will respond as soon as possible.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-zinc-300">Attachments</Label>
        <FileUpload files={formData.attachments} onFilesChange={updateFiles} />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 text-sm font-semibold rounded-lg bg-[#0060FE] hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Enquiry
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
