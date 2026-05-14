import { useState, useRef } from 'react';
import { CustomModel } from '@/components/ui/dialog';
import { Plus, FileText, Download, X } from 'lucide-react';
import { showToast } from '@/components/ui/custom-toast';
import { Button } from '@/components/ui/button';
import { FormSelect } from './OrderFormUI';

interface ImportOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File, customerId?: string) => void;
  isLoading: boolean;
  isAdmin?: boolean;
  customers?: { value: string; label: string }[];
}

export function ImportOrdersDialog({
  open,
  onOpenChange,
  onImport,
  isLoading,
  isAdmin = false,
  customers = []
}: ImportOrdersDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showToast('Please select a valid CSV file', 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    setSubmitted(true);
    if (!selectedFile) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    if (isAdmin && !selectedCustomer) {
      return;
    }

    onImport(selectedFile, isAdmin ? selectedCustomer : undefined);
  };

  const handleDownloadSample = () => {
    // Implement sample download logic or use a static URL
    // window.open('/api/customer/orders/import/sample', '_blank');
    showToast('Sample CSV download started', 'success');
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <CustomModel
      open={open}
      onOpenChange={(val) => {
        if (!isLoading) {
          onOpenChange(val);
          if (!val) {
            setSelectedFile(null);
            setSelectedCustomer('');
          }
        }
      }}
      title="Import orders by CSV"
      submitText="Import"
      onSubmit={handleUpload}
      isLoading={isLoading}
      onCancel={() => onOpenChange(false)}
      contentClass="sm:max-w-[450px]"
      customFooter={
        <Button
          variant="ghost"
          onClick={handleDownloadSample}
          disabled={isLoading}
          className="text-[12px] cursor-pointer font-bold text-primary hover:text-primary-hover hover:bg-transparent px-0 transition-colors flex items-center gap-2 tracking-wider"
        >
          <Download className="w-3.5 h-3.5" />
          <span className='leading-[100%]'>
            Download sample CSV
          </span>
        </Button>
      }
    >
      <div className="space-y-4 py-2">
        {isAdmin && (
          <div className="space-y-1.5">
            <FormSelect
              label="Select Customer"
              placeholder="Choose a customer"
              options={customers}
              value={selectedCustomer}
              onValueChange={(val) => setSelectedCustomer(val || '')}
              className="w-full"
              error={submitted && selectedCustomer === ''}
              errormsg="Please select a customer"
            />
          </div>
        )}

        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900/50'
            } ${selectedFile ? 'border-primary/20 bg-primary/5 dark:border-primary/30' : submitted && !selectedFile ? 'border-red-300 bg-red-50/40 dark:border-red-900/30' : 'border-gray-200 dark:border-zinc-800'
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
            disabled={isLoading}
          />

          {selectedFile ? (
            <div className="flex flex-col items-center gap-2 relative text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/30 flex items-center justify-center mb-1">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 max-w-[200px] truncate">
                {selectedFile.name}
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-8 -right-26 h-6 w-6 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700"
                onClick={clearFile}
              >
                <X className="w-3 h-3 text-slate-500" />
              </Button>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center border border-gray-100 dark:border-zinc-700">
                <Plus className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-sm font-bold text-slate-600 dark:text-zinc-400 tracking-wide text-[11px]">Upload File</span>
            </>
          )}
        </div>

        {/* <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={handleDownloadSample}
            disabled={isLoading}
            className="text-[12px] cursor-pointer font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-2 tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            Download sample CSV
          </Button>
        </div> */}
      </div>
    </CustomModel>
  );
}
