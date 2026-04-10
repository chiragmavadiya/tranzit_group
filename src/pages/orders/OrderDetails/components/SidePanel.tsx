import { useState, useRef, useCallback } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import SelectComponent from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Save } from 'lucide-react'
import { DOCUMENT_TYPES } from '../constants'

// Moved to constants.ts

interface UploadedDocument {
  id: string;
  name: string;
  category: string;
  size: string;
}


export const SidePanel: React.FC<{ orderType: string | undefined }> = ({ orderType }) => {
  const [tags, setTags] = useState<string[]>(['PRINTED BY: ZACK%40YOPMAIL.COM'])
  const [tagInput, setTagInput] = useState('')
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim().toUpperCase())) {
        setTags([...tags, tagInput.trim().toUpperCase()])
      }
      setTagInput('')
    }
  }, [tagInput, tags])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }, [tags])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError(null)

    if (!file) return

    // Validation: Size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      setUploadError('File size exceeds 1MB limit.')
      return
    }

    // Validation: Format
    const allowedFormats = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedFormats.includes(file.type)) {
      setUploadError('Only PDF, JPG, and PNG files are allowed.')
      return
    }

    const newDoc: UploadedDocument = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      category: selectedDocType,
      size: formatFileSize(file.size)
    }

    setUploadedDocs(prev => [...prev, newDoc])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [selectedDocType])

  const handleRemoveDoc = useCallback((id: string) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== id))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <Accordion type="multiple" defaultValue={['notes', 'documents', 'tags', 'details', 'breakdown']} className="flex flex-col gap-3">
        {/* NOTES */}
        <AccordionItem value="notes" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-[#0060FE] dark:[&>svg]:text-blue-500">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">NOTES</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 pb-4">
            <Textarea
              className="min-h-[100px] border-gray-200 dark:border-zinc-800 text-xs text-gray-700 dark:text-zinc-300 focus:border-[#0060FE] dark:focus:border-blue-500 focus:ring-0 focus-visible:ring-0 transition-all duration-200 shadow-none font-medium"
              placeholder="Add your notes here..."
            />
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium leading-4">
              Notes are internal by default, but may be printed on the packing slip depending on your settings.
            </p>
            {/* save button on right side */}
            {orderType !== 'new' && (
              <div className="flex justify-end">
                <Button onClick={() => {
                  const address = "B-710, Gopal palace, near zhanshi rani brts bus stnad, shivranjani Ahmedabad Gujarat India"
                  const url = `https://www.google.com/maps?q=${encodeURIComponent(address)}`
                  window.open(url, "_blank")
                }} className="w-fit flex items-center gap-2 bg-[#0060FE] text-white hover:bg-blue-700 h-8 px-4 rounded-md font-bold text-xs uppercase">
                  <Save className="h-4 w-4" />
                  SAVE
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* DOCUMENTS */}
        <AccordionItem value="documents" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-[#0060FE] dark:[&>svg]:text-blue-500">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">DOCUMENTS</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pb-4">
            <div className="flex flex-col gap-2">
              {uploadedDocs.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">No documents uploaded yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {uploadedDocs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 group animate-in slide-in-from-top-1 duration-200">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-100 truncate max-w-[200px]">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-[#0060FE] uppercase tracking-wider">{doc.category}</span>
                          <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-medium">{doc.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-900 dark:text-zinc-100 uppercase">Document type</label>
              <SelectComponent
                data={DOCUMENT_TYPES}
                value={selectedDocType}
                onValueChange={(val) => val && setSelectedDocType(val)}
                placeholder="Document type"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-fit flex items-center gap-2 border-[#0060FE] text-[#0060FE] hover:bg-blue-50 dark:hover:bg-blue-900/20 h-10 px-4 rounded-md font-bold text-xs uppercase"
              >
                <Upload className="h-4 w-4" />
                UPLOAD DOCUMENT
              </Button>
              {uploadError && (
                <p className="text-[10px] text-red-500 font-bold uppercase animate-in fade-in-0 duration-200">
                  {uploadError}
                </p>
              )}
            </div>

            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium uppercase mt-1">PDF, JPG or PNG up to 1 MB.</p>
          </AccordionContent>
        </AccordionItem>

        {/* TAGS */}
        <AccordionItem value="tags" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-[#0060FE] dark:[&>svg]:text-blue-500">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">TAGS</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 pb-4">
            <Input
              className="h-10 text-xs border-gray-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-[#0060FE] dark:focus-visible:border-blue-500 font-medium"
              placeholder="Search for or create a new tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <div key={tag} className="inline-flex items-center gap-1.5 px-2 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded text-[9px] font-bold text-gray-700 dark:text-zinc-300 transition-colors uppercase animate-in zoom-in-95 duration-200">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-0.5 transition-colors group"
                  >
                    <X className="h-3 w-3 text-red-600 dark:text-red-500 transition-colors group-hover:scale-110" />
                  </button>
                </div>
              ))}
              {tags.length === 0 && !tagInput && (
                <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-medium italic py-1">No tags added yet. Type and press Enter.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ADDITIONAL DETAILS */}
        <AccordionItem value="details" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-[#0060FE] dark:[&>svg]:text-blue-500">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">ADDITIONAL DETAILS</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pb-4 mt-1">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-700 dark:text-zinc-400">Order #</span>
              <span className="text-gray-700 dark:text-zinc-200">5</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-700 dark:text-zinc-400">Reference</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-gray-700 dark:text-zinc-400">Insurance Value</span>
              <span className="text-gray-700 dark:text-zinc-200">0.00</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* BREAKDOWN */}
        <AccordionItem value="breakdown" className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm px-5 border-b overflow-hidden transition-colors duration-300">
          <AccordionTrigger className="hover:no-underline py-3 px-0 [&>svg]:text-[#0060FE] dark:[&>svg]:text-blue-500">
            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wider">BREAKDOWN</span>
          </AccordionTrigger>
          <AccordionContent className="text-gray-500 dark:text-zinc-400 text-xs text-uppercase font-bold tracking-tight">
            No breakdown data.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
