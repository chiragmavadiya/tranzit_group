import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileUpload } from './FileUpload';
import { COUNTRY, FEEDBACK_CATEGORIES, ISSUE_CATEGORIES, PARCEL_ENQUIRY_TYPE, SENDER_RECEIVER } from '../constants';
import type { EnquiryFormData, IssueCategory } from '../types';
import { Send, CheckCircle2 } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';
import { useCreateEnquiry } from '../hooks/useEnquiries';

export function EnquiryForm() {
  const [formData, setFormData] = useState<EnquiryFormData>({
    issue_type: '',
    reply_email: '',
    message: '',
    attachments: [],
    nature_of_issue: '',
    sender_role: '',
    local_country: '',
    contact_number: '',
    feedback_category: '',
  });

  const [isSubmited, setIsSubmited] = useState(false);
  const { mutate, isPending, isSuccess, reset } = useCreateEnquiry();

  const validateForm = () => {
    // General required fields
    if (!formData.issue_type || !formData.reply_email || !formData.message) {
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.reply_email)) {
      return false;
    }

    // Conditional requirements
    if (formData.issue_type === 'parcel') {
      if (!formData.nature_of_issue) return false;
    }

    if (formData.issue_type === 'sender') {
      if (!formData.sender_role || !formData.local_country || !formData.contact_number) return false;
    }

    if (formData.issue_type === 'feedback') {
      if (!formData.feedback_category) return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmited(true);

    if (!validateForm()) {
      return;
    }

    const payload = new FormData();
    payload.append('issue_type', formData.issue_type);
    payload.append('reply_email', formData.reply_email);
    payload.append('message', formData.message);

    if (formData.issue_type === 'parcel' && formData.nature_of_issue) {
      payload.append('nature_of_issue', formData.nature_of_issue);
    }

    if (formData.issue_type === 'sender') {
      if (formData.sender_role) payload.append('sender_role', formData.sender_role);
      if (formData.local_country) payload.append('local_country', formData.local_country);
      if (formData.contact_number) payload.append('contact_number', formData.contact_number);
    }

    if (formData.issue_type === 'feedback' && formData.feedback_category) {
      payload.append('feedback_category', formData.feedback_category);
    }

    // Append attachments
    formData.attachments.forEach((file) => {
      payload.append('attachments[]', file);
    });

    mutate(payload);
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
          Your enquiry has been received. Our support team will get back to you at <strong>{formData.reply_email}</strong> as soon as possible.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            reset();
            setIsSubmited(false);
            setFormData({
              issue_type: '',
              reply_email: '',
              message: '',
              attachments: [],
              nature_of_issue: '',
              sender_role: '',
              local_country: '',
              contact_number: '',
              feedback_category: '',
            });
          }}
          className="rounded-full px-8"
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormSelect
            label='Issue Category'
            placeholder='Select enquiry'
            value={formData?.issue_type || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, issue_type: (value || '') as IssueCategory }))}
            className="border-gray-200 dark:border-zinc-800"
            required
            options={ISSUE_CATEGORIES}
            error={isSubmited && formData.issue_type === ''}
            errormsg='Please select an enquiry category'
          />
        </div>

        <div className="space-y-2">
          <FormInput
            label='Reply Email'
            type='email'
            placeholder='Enter your email'
            value={formData.reply_email}
            onChange={(value) => setFormData(prev => ({ ...prev, reply_email: value }))}
            className="border-gray-200 dark:border-zinc-800"
            required
            error={isSubmited && (!formData.reply_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reply_email))}
            errormsg='Please enter a valid email address'
          />
        </div>

        {formData.issue_type === 'sender' && (
          <>
            <div className="space-y-2">
              <FormSelect
                label="I'm the sender/receiver"
                placeholder='Select your role'
                value={formData?.sender_role || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sender_role: value || '' }))}
                className="border-gray-200 dark:border-zinc-800"
                required
                options={SENDER_RECEIVER}
                error={isSubmited && formData.issue_type === 'sender' && !formData.sender_role}
                errormsg='Please select your role'
              />
            </div>
            <div className="space-y-2">
              <FormSelect
                label="Local Country"
                placeholder='Select local country'
                value={formData?.local_country || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, local_country: value || '' }))}
                className="border-gray-200 dark:border-zinc-800"
                required
                options={COUNTRY}
                error={isSubmited && formData.issue_type === 'sender' && !formData.local_country}
                errormsg='Please select local country'
              />
            </div>
            <div className="space-y-2">
              <FormInput
                label="Contact Number"
                placeholder='Enter your contact number'
                value={formData?.contact_number || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, contact_number: value }))}
                className="border-gray-200 dark:border-zinc-800"
                required
                error={isSubmited && formData.issue_type === 'sender' && !formData.contact_number}
                errormsg='Please enter contact number'
              />
            </div>
          </>
        )}

        {formData.issue_type === 'parcel' && (
          <div className="space-y-2">
            <FormSelect
              label='Nature of Issue'
              placeholder='Select nature of issue'
              value={formData?.nature_of_issue || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, nature_of_issue: value || '' }))}
              className="border-gray-200 dark:border-zinc-800"
              required
              options={PARCEL_ENQUIRY_TYPE}
              error={isSubmited && formData.issue_type === 'parcel' && !formData.nature_of_issue}
              errormsg='Please select nature of issue'
            />
          </div>
        )}
        {formData.issue_type === 'feedback' && (
          <div className="space-y-2">
            <FormSelect
              label='Feedback Category'
              placeholder='Select feedback category'
              value={formData?.feedback_category || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, feedback_category: value || '' }))}
              className="border-gray-200 dark:border-zinc-800"
              required
              options={FEEDBACK_CATEGORIES}
              error={isSubmited && formData.issue_type === 'feedback' && !formData.feedback_category}
              errormsg='Please select feedback category'
            />
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <FormTextarea
          label='How can we help?'
          placeholder='Please describe your issue in detail...'
          value={formData.message}
          onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
          rows={3}
          isFullWidth
          required
          error={isSubmited && formData.message === ''}
          errormsg='Please enter your message'
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
          disabled={isPending}
          className="w-full h-11 text-sm font-semibold rounded-lg bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
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
