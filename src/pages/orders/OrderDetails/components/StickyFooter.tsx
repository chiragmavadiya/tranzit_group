import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Save,
  Download,
  Printer,
  ChevronUp
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const StickyFooter: React.FC<{ orderType: string | undefined }> = ({ orderType }) => {
  return (
    <div className="sticky -bottom-0 -left-5 right-20 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 p-3 flex justify-center items-center gap-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] transition-colors duration-300">
      {orderType === 'new' && (
        <>
          <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-[#0060FE] font-bold h-8 px-6 uppercase text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
            <Save className="h-4 w-4" />
            SAVE
          </Button>

          <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-[#0060FE] font-bold h-8 px-6 uppercase text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
            <Download className="h-4 w-4" />
            DOWNLOAD
          </Button>
          <div className="flex bg-[#0060FE] rounded-md overflow-hidden">
            <Button className="bg-[#0060FE] text-white hover:bg-blue-700 flex items-center gap-2 border-r border-blue-500/50 rounded-none h-8 px-6 font-bold uppercase text-xs">
              <Printer className="h-4 w-4" />
              PRINT AND OPEN NEXT
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-[#0060FE] text-white hover:bg-blue-700 rounded-none w-8 flex items-center justify-center h-8 border-l border-white/20 cursor-pointer outline-none">
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
      {orderType !== 'new' && (
        <Button variant="outline" className="flex items-center gap-2 border-blue-600 dark:border-zinc-800 text-[#0060FE] font-bold h-8 px-6 uppercase text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
          <Printer className="h-4 w-4" />
          Reprint Lable
        </Button>
      )}
    </div>
  )
}
