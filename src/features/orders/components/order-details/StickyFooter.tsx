import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Save,
  Download,
  Printer,
  ChevronUp,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface StickyFooterProps {
  orderType: string | undefined
  onSave?: () => void
  saveLoading: boolean
  onConsign?: () => void
}

export const StickyFooter: React.FC<StickyFooterProps> = ({ orderType, onSave, saveLoading, onConsign }) => {
  return (
    <div className="sticky bottom-0 -left-5 right-20 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 p-3 flex justify-center items-center gap-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] transition-colors duration-300">
      {orderType === 'new' && (
        <>
          <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-primary font-bold h-8 px-6 uppercase text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
            <Save className="h-4 w-4" />
            SAVE
          </Button>

          <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-primary font-bold h-8 px-6 uppercase text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
            <Download className="h-4 w-4" />
            DOWNLOAD
          </Button>
          <div className="flex bg-primary rounded-md overflow-hidden">
            <Button className="bg-primary text-white hover:bg-primary-hover flex items-center gap-2 border-r border-white/10 rounded-none h-8 px-6 font-bold uppercase text-xs">
              <Printer className="h-4 w-4" />
              PRINT AND OPEN NEXT
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-primary text-white hover:bg-primary-hover rounded-none w-8 flex items-center justify-center h-8 border-l border-white/20 cursor-pointer outline-none">
                <ChevronUp className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mb-2 dark:bg-zinc-900 dark:border-zinc-800">
                <DropdownMenuItem>Print Only</DropdownMenuItem>
                <DropdownMenuItem>Save and Close</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
      {(orderType === 'create' || orderType === 'create-menual') && (
        <Button
          onClick={onSave}
          variant="default"
          disabled={saveLoading}
          className={`flex items-center gap-2 h-8 px-6 uppercase text-xs font-bold transition-all bg-primary hover:bg-primary-hover text-white shadow-sm`}
        >
          {saveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      )}
      {orderType === 'consign' && (
        <Button
          onClick={onConsign}
          variant="default"
          disabled={saveLoading}
          className={`flex items-center gap-2 h-8 px-6 uppercase text-xs font-bold transition-all bg-primary hover:bg-primary-hover text-white shadow-sm`}
        >
          {saveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Consign order
        </Button>
      )}
    </div>
  )
}
