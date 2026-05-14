import { useState, useCallback } from 'react';
import { Upload, X, File as FileIcon, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function FileUpload({ files, onFilesChange, maxFiles = 5, maxSizeMB = 10 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSizeMB;
    });

    const updatedFiles = [...files, ...validFiles].slice(0, maxFiles);
    onFilesChange(updatedFiles);
  }, [files, maxFiles, maxSizeMB, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [addFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  }, [addFiles]);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-primary" />;
    if (file.type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <FileIcon className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5 dark:bg-primary/10 scale-[1.01]" 
            : "border-gray-200 dark:border-zinc-800 hover:border-primary hover:bg-gray-50 dark:hover:bg-zinc-900/50"
        )}
        onClick={() => document.getElementById('file-upload-input')?.click()}
      >
        <input
          id="file-upload-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
        />
        
        <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 text-primary">
          <Upload className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Supports JPEG, PNG, PDF, Excel up to {maxSizeMB}MB (Max {maxFiles} files)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {files.map((file, index) => (
            <div 
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(file)}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-zinc-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
