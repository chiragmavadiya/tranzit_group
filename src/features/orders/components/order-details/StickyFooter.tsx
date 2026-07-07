import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Save,
  Printer,
  Loader2
} from 'lucide-react'

interface StickyFooterProps {
  orderType: string | undefined
  onSave?: (skipWalletCheck: string | boolean) => void
  saveLoading: boolean
  isSavingDraft?: boolean
  isCreatingConsignment?: boolean
  onConsign?: () => void
  isConsigning: boolean
  isServicePending?: boolean
}

export const StickyFooter: React.FC<StickyFooterProps> = ({ orderType, onSave, saveLoading, isSavingDraft, isCreatingConsignment, onConsign, isConsigning, isServicePending }) => {
  if (!['new', 'create', 'create-menual', 'consign', 'return'].includes(orderType || '')) return null;
  return (
    <div className="sticky bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 p-2.5 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.25)] transition-colors duration-300">
      {(orderType === 'create' || orderType === 'return') && (
        <>
          <Button
            onClick={() => onSave?.('saveAsDraft')}
            variant="default"
            disabled={isSavingDraft || isServicePending}
            className="flex items-center gap-2 h-8 px-4 uppercase text-[11px] font-bold tracking-wider w-full sm:w-auto"
          >
            {isSavingDraft ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Draft
          </Button>

          <Button
            variant="default"
            disabled={isCreatingConsignment || isServicePending}
            onClick={() => onSave?.(false)}
            className="flex items-center gap-2 h-8 px-4 uppercase text-[11px] font-bold tracking-wider w-full sm:w-auto"
          >
            {isCreatingConsignment ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Printer className="h-3.5 w-3.5" />}
            Create Consignment & Download Label
          </Button>
        </>
      )}
      {(orderType === 'create-menual') && (
        <>
          <Button
            onClick={() => onSave?.('saveAsDraft')}
            variant="default"
            disabled={isCreatingConsignment || isServicePending}
            className="flex items-center gap-2 h-8 px-4 uppercase text-[11px] font-bold tracking-wider w-full sm:w-auto"
          >
            {isCreatingConsignment ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Create Manual Order
          </Button>
        </>
      )}

      {orderType === 'consign' && (
        <>
          <Button
            onClick={() => onSave?.('saveAsDraft')}
            variant="default"
            disabled={isSavingDraft || isServicePending}
            className="flex items-center gap-2 h-8 px-4 uppercase text-[11px] font-bold tracking-wider w-full sm:w-auto"
          >
            {isSavingDraft ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Draft
          </Button>
          <Button
            onClick={onConsign}
            variant="default"
            disabled={saveLoading || isConsigning || isServicePending}
            className="flex items-center gap-2 h-8 px-4 uppercase text-[11px] font-bold tracking-wider w-full sm:w-auto bg-primary hover:bg-primary-hover text-white shadow-sm"
          >
            {saveLoading || isConsigning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Create Consignment & Download Label
          </Button>
        </>
      )}
    </div>
  )
}
