import { useState, useMemo, useRef, useCallback } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { FormInput, FormSelect, FormTextarea } from '@/features/orders/components/OrderFormUI';
import { RichTextEditorComponent } from './RichTextEditor';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ARTICLE_CATEGORIES } from '../constants';
import type { HelpArticle } from '../types';

interface AddArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<HelpArticle>) => void;
  initialData?: HelpArticle | null;
}

export function AddArticleDialog({ open, onOpenChange, onSubmit, initialData }: AddArticleDialogProps) {
  const initialValues = useMemo(() => ({
    title: '',
    slug: '',
    category: ARTICLE_CATEGORIES[0].value,
    status: 'Published',
    content: ''
  }), []);

  const formDataToLoad = useMemo(() => {
    if (initialData) return initialData;
    return initialValues;
  }, [initialData, initialValues]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <CustomModel
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Article" : "Create Article"}
      onSubmit={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      submitText="Save Article"
      cancelText="Cancel"
      contentClass="sm:max-w-[850px]"
    >
      <ArticleForm
        key={initialData ? `edit-${initialData.id}` : 'new'}
        ref={formRef}
        initialValues={formDataToLoad}
        onSubmit={onSubmit}
      />
    </CustomModel>
  );
}

interface ArticleFormProps {
  initialValues: any;
  onSubmit: (data: any) => void;
}

const ArticleForm = ({ initialValues, onSubmit, ref }: ArticleFormProps & { ref: any }) => {
  const [formData, setFormData] = useState({
    ...initialValues,
    isPublished: initialValues.status === 'Published'
  });
  const [submited, setSubmited] = useState(false);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (field === 'title') {
      const slug = value.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev: any) => ({ ...prev, slug: `/${slug}` }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);

    const requiredFields = ['title', 'slug', 'category', 'content'];
    const hasErrors = requiredFields.some(field => !formData[field]);
    if (hasErrors) return;

    const { isPublished, ...rest } = formData;
    const finalData = {
      ...rest,
      status: isPublished ? 'Published' : 'Draft'
    };
    console.log(finalData, 'finalData');

    onSubmit(finalData);
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
          label="Short Description"
          placeholder="Account Registration Process"
          value={formData.shortDescription || ''}
          onChange={(val) => handleInputChange('shortDescription', val)}
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
          checked={formData.isPublished}
          onCheckedChange={(val) => handleInputChange('isPublished', val)}
        />
        <Label htmlFor="published-status" className="text-sm font-bold text-slate-700 dark:text-zinc-300 cursor-pointer">
          Published (visible in customer portal)
        </Label>
      </div>
    </form>
  );
};
