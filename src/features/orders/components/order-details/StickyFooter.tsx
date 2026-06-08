import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Save,
  Printer,
  Loader2
} from 'lucide-react'

interface StickyFooterProps {
  orderType: string | undefined
  onSave?: (skipWalletCheck: boolean) => void
  saveLoading: boolean
  onConsign?: () => void
  isConsigning: boolean
}

export const StickyFooter: React.FC<StickyFooterProps> = ({ orderType, onSave, saveLoading, onConsign, isConsigning }) => {
  if (!['new', 'create', 'create-menual', 'consign', 'return'].includes(orderType || '')) return null;
  return (
    <div className="sticky bottom-0 -left-5 right-20 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 p-3 flex justify-center items-center gap-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] transition-colors duration-300">
      {(orderType === 'create' || orderType === 'create-menual' || orderType === 'return') && (
        <>
          <Button
            onClick={() => onSave?.(true)}
            variant="default"
            disabled={saveLoading}
          >
            {saveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </Button>

          <div className="flex bg-primary rounded-md overflow-hidden">
            <Button onClick={() => onSave?.(false)} className="bg-primary text-white hover:bg-primary-hover flex items-center gap-2 border-r border-white/10 rounded-none h-8 px-6 font-bold uppercase text-xs">
              <Printer className="h-4 w-4" />
              Create Consignment & Download Label
            </Button>
          </div>
        </>
      )}

      {orderType === 'consign' && (
        <Button
          onClick={onConsign}
          variant="default"
          disabled={saveLoading || isConsigning}
          className={`flex items-center gap-2 h-8 px-6 uppercase text-xs font-bold transition-all bg-primary hover:bg-primary-hover text-white shadow-sm`}
        >
          {saveLoading || isConsigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Create Consignment & Download Label
        </Button>
      )}
    </div>
  )
}
