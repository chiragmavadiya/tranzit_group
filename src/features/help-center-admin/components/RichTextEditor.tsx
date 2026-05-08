import { lazy, Suspense } from 'react';

const TextEditor = lazy(() => import('@/components/common/TextEditor'))

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
}

/**
 * RichTextEditorComponent
 * A premium wrapper around the Tiptap-based TextEditor.
 */
export function RichTextEditorComponent({ value, onChange, label, required }: RichTextEditorProps) {
  return (
    <div className="space-y-1.5 flex flex-col h-full">
      {label && (
        <label className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider ml-0.5 flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="rte-container border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950 flex flex-col focus-within:ring-2 focus-within:ring-blue-600/10 focus-within:border-blue-600 transition-all min-h-[500px]">
        <Suspense fallback={null}>
          <TextEditor value={value} onChange={onChange} />
        </Suspense>
      </div>
    </div>
  );
}
