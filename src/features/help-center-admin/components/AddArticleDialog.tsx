import { useState, useMemo, useRef, useCallback } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';
import { RichTextEditorComponent } from './RichTextEditor';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ARTICLE_CATEGORIES } from '../constants';
import { useHelpArticleMutations, useHelpArticleDetails } from '../hooks/useHelpCenterAdmin';
import type { HelpArticle, HelpArticleFormData } from '../types';
import React from 'react';

interface AddArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: HelpArticle | null;
}

export function AddArticleDialog({ open, onOpenChange, initialData }: AddArticleDialogProps) {
  const { createArticle, isCreating, updateArticle, isUpdating } = useHelpArticleMutations();

  const { data: detailsResponse, isLoading: isFetching } = useHelpArticleDetails(initialData?.id || null);

  const surchargeDetails = detailsResponse?.data;
  const isLoading = isCreating || isUpdating;

  const initialValues = useMemo(() => ({
    title: '',
    category: ARTICLE_CATEGORIES[0].value,
    excerpt: '',
    content: '',
    is_published: true
  }), []);

  const formDataToLoad = useMemo(() => {
    const data = surchargeDetails || initialData;
    if (data) {
      return {
        title: data.title,
        category: data.category,
        excerpt: data.excerpt || '',
        content: data.content || '',
        is_published: data.is_published ?? (data.status === 'Published')
      };
    }
    return initialValues;
  }, [surchargeDetails, initialData, initialValues]);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (data: HelpArticleFormData) => {
    if (initialData) {
      updateArticle({ id: initialData.id, data }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createArticle(data, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  return (
    <CustomModel
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Article" : "Create Article"}
      onSubmit={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      submitText={initialData ? "Update Article" : "Save Article"}
      cancelText="Cancel"
      contentClass="sm:max-w-[850px]"
      isLoading={isLoading}
    >
      {isFetching && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading article details...</p>
          </div>
        </div>
      )}
      {open && (
        <ArticleForm
          key={initialData?.id || 'new'}
          ref={formRef}
          initialValues={formDataToLoad}
          onSubmit={handleSubmit}
        />
      )}
    </CustomModel>
  );
}

interface ArticleFormProps {
  initialValues: HelpArticleFormData;
  onSubmit: (data: HelpArticleFormData) => void;
}

const ArticleForm = ({ initialValues, onSubmit, ref }: ArticleFormProps & { ref: any }) => {
  const [formData, setFormData] = useState<HelpArticleFormData>({
    ...initialValues
  });
  const [submited, setSubmited] = useState(false);

  const handleInputChange = useCallback((field: keyof HelpArticleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);

    if (!formData.title || !formData.category || !formData.content) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="grid grid-cols-12 gap-x-6 gap-y-5 py-4">
      <div className="col-span-12 md:col-span-6">
        <FormSelect
          label="Category"
          placeholder="Select category"
          options={ARTICLE_CATEGORIES}
          value={formData.category}
          onValueChange={(val) => handleInputChange('category', val || '')}
          required
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <FormInput
          label="Article Title"
          placeholder="e.g. Registration & Account set up"
          required
          value={formData.title}
          onChange={(val) => handleInputChange('title', val)}
          error={submited && !formData.title}
          errormsg="Title is required"
        />
      </div>
      <div className="col-span-12">
        <FormTextarea
          label="Short Description (Excerpt)"
          placeholder="Account Registration Process"
          value={formData.excerpt || ''}
          onChange={(val) => handleInputChange('excerpt', val)}
          rows={2}
        />
      </div>
      <div className="col-span-12">
        <RichTextEditorComponent
          label="Article Content"
          required
          value={formData.content}
          onChange={(val) => handleInputChange('content', val)}
        />
        {submited && !formData.content && (
          <p className="text-red-500 text-[11px] mt-1 font-bold">Content is required</p>
        )}
      </div>

      <div className="col-span-12 flex items-center gap-3 pt-2">
        <Switch
          id="published-status"
          checked={formData.is_published}
          onCheckedChange={(val) => handleInputChange('is_published', val)}
        />
        <Label htmlFor="published-status" className="text-sm font-bold text-slate-700 dark:text-zinc-300 cursor-pointer">
          Published (visible in customer portal)
        </Label>
      </div>
    </form>
  );
};
