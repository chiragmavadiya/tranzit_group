import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Box, MapPin, Download, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import { DropdownUI } from '@/features/orders/components/OrderFormUI'
import { ConformationModal } from '@/components/common/ConformationModal'
import type { OrderDetailData } from '../../types/order-details.types'
import { cn } from '@/lib/utils'
import { Order_status_styles } from '../../constants'
import { useAppSelector } from '@/hooks/store.hooks'
import { FormSelect } from '../OrderFormUI'
import { useCustomers } from '@/features/customers/hooks/useCustomers'


interface OrderHeaderProps {
  orderID?: string
  orderType?: string
  onSave?: () => void
  onDownloadLabel?: () => void
  isDownloadingLabel?: boolean
  orderDetail: OrderDetailData
  selectedCustomer: string
  setSelectedCustomer: React.Dispatch<React.SetStateAction<string>>
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ 
  orderID = '4', 
  orderType = 'create', 
  onSave, 
  onDownloadLabel,
  isDownloadingLabel,
  orderDetail, 
  selectedCustomer, 
  setSelectedCustomer 
}) => {
  const navigate = useNavigate()
  const { role } = useAppSelector((state) => state.auth)
  const [showConfirm, setShowConfirm] = useState(false)

  const { data: customersData } = useCustomers({ pageSize: 1000 }, role === 'admin');

  const handleBack = () => {
    if (orderType !== 'create') {
      navigate(`${role === 'admin' ? '/admin' : ''}/orders`)
    } else {
      setShowConfirm(true)
    }
  }

  const handleDiscard = () => {
    setShowConfirm(false)
    navigate(-1)
  }

  const handleSave = () => {
    setShowConfirm(false)
    onSave?.()
  }

  return (
    <div className="flex flex-col gap-3 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 transition-colors duration-300 pb-3 pt-0 lg:pb-4">
      <ConformationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSave}
        onCancel={handleDiscard}
        title="Save changes?"
        description="If you don't save, your recent changes will be discarded."
        confirmText="SAVE"
        cancelText="Discard"
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-8">
          <Button
            // variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 bg-[#0060FE] text-white hover:bg-[#0052D9] px-4 rounded-md h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary border-r border-gray-200 dark:border-zinc-800 pr-3">
              <Box className="h-5 w-5 text-[#0060FE]" />
              <span className="text-xl font-bold text-gray-900 dark:text-zinc-100">{orderType === 'create' ? 'NEW ORDER' : orderID}</span>
            </div>
            {/* <div className="flex items-center gap-2 px-0">
              <span className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">{orderType === 'create' ? 'NEW ORDER' : 'EDIT ORDER'}</span>
            </div> */}
            <div className="flex items-center gap-1 text-[#0060FE] font-medium">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">AUSTRALIA</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* {orderType !== 'new' && (
            <DropdownUI
              label="Print"
              icon="ChevronDown"
              onClick={(value) => console.log(value)}
              options={[
                { value: 'reprint_shipping_label', label: 'Reprint shipping label' },
                { value: 'redownload_shipping_label', label: 'Redownload shipping label' },
                { value: 'print_packing_slip', label: 'Print packing slip' },
                { value: 'print_packing_summary', label: 'Print packing summary' },
              ]}
            />
          )}
          <DropdownUI
            label="More actions"
            icon="ChevronDown"
            onClick={(value) => console.log(value)}
            options={[
              { value: 'print_packing_slip', label: 'Print packing slip' },
              { value: 'print_packing_summary', label: 'Print packing summary' },
              { value: 'archive_order', label: 'Archive order' },
              { value: 'delete_order', label: 'Delete order' },
            ]}
          /> */}

          {orderType !== 'create' && (
            <>
              <Button 
                variant="outline" 
                onClick={onDownloadLabel}
                disabled={isDownloadingLabel}
                className="flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold h-8 px-4 text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
              >
                {isDownloadingLabel ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                DOWNLOAD LABEL
              </Button>
              <Button variant="outline" className="flex items-center gap-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold h-8 px-4 text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                <Trash2 className="h-4 w-4" />
                DELETE ORDER
              </Button>
            </>
          )}

          {role === 'admin' && (
            <FormSelect
              label={orderType !== "create" ? "" : "Customer"}
              placeholder="Select Customer"
              value={selectedCustomer}
              onValueChange={(val) => setSelectedCustomer(val || 'all')}
              options={customersData?.data?.map((c: any) => ({
                value: c.id.toString(),
                label: `${c.first_name} ${c.last_name}`
              })) || []}
              className='w-60'
              disabled={orderType !== "create"}
            />
          )}
        </div>
      </div>

      {orderType !== 'create' && (<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-zinc-400 font-medium">
        <Badge variant="secondary" className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-none rounded-sm px-2 py-0 h-5 uppercase font-bold">
          {orderDetail?.order_type || 'NEW'}
        </Badge>


        <div className="flex items-center gap-1">
          Created <span className="text-gray-700 dark:text-zinc-300">{orderDetail?.created_human}</span>
        </div>
        <Badge variant="secondary" className={cn("border-none rounded-sm px-2 py-0 h-5 uppercase font-bold", Order_status_styles[orderDetail?.status || 'New'])}>
          {orderDetail?.status || 'NEW'}
        </Badge>
      </div>)}
    </div>
  )
}
