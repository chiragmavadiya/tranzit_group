import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { ArchiveRestore, ArrowLeft, Box, ChevronDown, ClipboardList, Download, FileText, Loader2, PackagePlus, Printer, Trash2, Package, Copy } from 'lucide-react'
=======
import { ArchiveRestore, ArrowLeft, Box, Download, Loader2, PackagePlus, Trash2, Package, Copy } from 'lucide-react'
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownCustomMenu } from '@/components/ui/dropdown-menu'
// import { DropdownUI } from '@/features/orders/components/OrderFormUI'
import { ConformationModal } from '@/components/common/ConformationModal'
import type { OrderDetailData } from '../../types/order-details.types'
import { cn } from '@/lib/utils'
import { Order_status_styles } from '../../constants'
import { useAppSelector } from '@/hooks/store.hooks'
import { FormSelect, FormInput } from '../OrderFormUI'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { CustomTooltip } from '@/components/common/CustomTooltip'
import type { AddressData } from '../../types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
<<<<<<< HEAD
import { useAddManualTrackingNumbers, useDownloadPackingDocument } from '../../hooks/useOrders'
import type { PackingDocument } from '../../services/orders.api'
=======
import { useAddManualTrackingNumbers } from '../../hooks/useOrders'
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
import { useRestoreOrderConfirm } from '../../hooks/useRestoreOrderConfirm'
import { canRestoreByPaymentStatus } from '../../utils/order-details.utils'


interface OrderHeaderProps {
  orderID?: string
  orderType?: string
  onSave?: () => void
  onDownloadLabel?: () => void
  isDownloadingLabel?: boolean
  orderDetail: OrderDetailData
  selectedCustomer?: number
  setSelectedCustomer: React.Dispatch<React.SetStateAction<number | undefined>>
  onCancelOrder?: (value: boolean) => void
  onArchiveOrder?: (value: boolean) => void
  isCancelling?: boolean
  onConsign?: () => void
  isConsigning?: boolean
  setShowCancelModal: React.Dispatch<React.SetStateAction<boolean>>
  showCancelModal: boolean
  showArchiveModal: boolean
  setShowArchiveModal: React.Dispatch<React.SetStateAction<boolean>>
  requiresManualLabel?: boolean
  // for clone
  itemsData: any;
  courierData: any;
  addressData: {
    sender: AddressData;
    receiver: AddressData;
  };
  signatureSelected: boolean;
  insuranceSelected: boolean;
  deliveryInstructions: string
  canReadWrite: boolean;
  activeSettings: Record<string, boolean>;
  quoteData?: any;
}


export const OrderHeader: React.FC<OrderHeaderProps> = ({
  orderID = '4',
  orderType = 'create',
  onSave,
  onDownloadLabel,
  isDownloadingLabel,
  orderDetail,
  selectedCustomer,
  setSelectedCustomer,
  onCancelOrder,
  onArchiveOrder,
  isCancelling,
  // onConsign,
  isConsigning,
  setShowCancelModal,
  showArchiveModal,
  setShowArchiveModal,
  showCancelModal,
  requiresManualLabel,
  // for clone
  itemsData,
  courierData,
  addressData,
  signatureSelected,
  insuranceSelected,
  deliveryInstructions,
  canReadWrite = true,
  activeSettings,
  quoteData
}) => {
  const navigate = useNavigate()
  const { role } = useAppSelector((state) => state.auth)
  const [showConfirm, setShowConfirm] = useState(false)

  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingError, setTrackingError] = useState(false)

  const addTrackingMutation = useAddManualTrackingNumbers()

<<<<<<< HEAD
  const { mutate: downloadPackingDocument, isPending: isDownloadingPackingDocument } = useDownloadPackingDocument()

  const handlePackingDownload = (documentType: PackingDocument) => {
    if (isDownloadingPackingDocument || !orderDetail?.order_number) return
    downloadPackingDocument({ document: documentType, orderNumbers: [orderDetail.order_number] })
  }

=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
  const { requestRestore, restoreModal, isRestoring } = useRestoreOrderConfirm()
  // Restoring an archived order is admin-only, and only while the order is still unpaid.
  const canRestoreOrder = role === 'admin'
    && orderDetail?.order_status_category === 'archived'
    && canRestoreByPaymentStatus(orderDetail?.payment_status)

  const handleOpenTrackingModal = () => {
    setTrackingNumber('')
    setTrackingError(false)
    setIsTrackingModalOpen(true)
  }

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) {
      setTrackingError(true)
      return
    }

    addTrackingMutation.mutate({
      orderNumber: orderDetail.order_number,
      data: {
        tracking_number: trackingNumber.trim()
      }
    }, {
      onSuccess: () => {
        setIsTrackingModalOpen(false)
      }
    })
  }

  const { data: customersData } = useCustomers({ per_page: 1000 }, role === 'admin' && (orderType === 'create' || orderType === 'consign'));

  const isCreate = useMemo(() => {
    return orderType === 'create' || orderType === 'create-menual' || orderType === 'return'
  }, [orderType])

  const handleBack = () => {
    if (!isCreate) {
      navigate(`${role === 'admin' ? '/admin' : ''}/orders?tab=${localStorage.getItem('order_tab') || 'new'}`)
    } else {
      setShowConfirm(true)
    }
  }

  const handleDiscard = () => {
    setShowConfirm(false)
    navigate(`${role === 'admin' ? '/admin' : ''}/orders?tab=${localStorage.getItem('order_tab') || 'new'}`)
  }

  const handleSave = () => {
    setShowConfirm(false)
    onSave?.()
  }

  const onConsign = () => {
    const rolePath = role === 'admin' ? '/admin' : ''
    navigate(`${rolePath}/orders/consign/${orderID}`)
  }

  const onCloneOrder = () => {
    const rolePath = role === 'admin' ? '/admin' : ''
    if (orderType === 'consign') {
      localStorage.setItem('quote_items', JSON.stringify(itemsData));
      localStorage.setItem('quote_courier', JSON.stringify({ courier: courierData }));
      localStorage.setItem('quote_sender', JSON.stringify(addressData.sender));
      localStorage.setItem('quote_receiver', JSON.stringify(addressData.receiver));
      localStorage.setItem('quote_insurance', String(insuranceSelected));
      localStorage.setItem('quote_signature', String(signatureSelected));
      localStorage.setItem('quote_delivery_instructions', String(deliveryInstructions));
      localStorage.setItem('quote_active_settings', JSON.stringify(activeSettings));
      if (quoteData?.surcharges && quoteData?.surcharges.length > 0) {
        localStorage.setItem('quote_surcharges', JSON.stringify(quoteData.surcharges));
      }

    } else {
      localStorage.setItem('order_to_clone', orderDetail.order_number)
    }
    // localStorage.setItem('quote_address', JSON.stringify(addressData));
    window.open(`${rolePath}/orders/create`, '_blank')
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
        <div className="flex flex-wrap items-center gap-4 lg:gap-8">
          <Button
            // variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 leading-relaxed bg-primary text-white hover:bg-primary-hover px-4 rounded-md h-9"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              {orderType === 'return' ? <Package className="h-5 w-5 text-primary" /> : <Box className="h-5 w-5 text-primary" />}
              <span className="text-xl font-bold text-gray-900 dark:text-zinc-100">{isCreate ? (orderType === 'return' ? 'RETURN ORDER' : 'CREATE NEW ORDER') : orderID}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          {canReadWrite && orderType !== 'consign' && orderType !== 'create' && orderType !== 'create-menual' && orderDetail?.order_status_category === 'new' && (
            <Button
              variant="outline"
              onClick={onConsign}
              disabled={isConsigning}
              className="flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold h-8 px-4 text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {isConsigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackagePlus className="h-4 w-4" />}
              Consign Order
            </Button>

          )}
          {canReadWrite && orderType !== 'create' && orderType !== 'create-menual' && orderType !== 'return' && (
            <>
              {role === 'admin' && requiresManualLabel && (
                <Button
                  onClick={handleOpenTrackingModal}
                  className="flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold h-8 px-4 text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                  variant="outline"
                >
                  Add Tracking number
                </Button>
              )}
              {(orderDetail?.order_status_category !== 'new' && orderDetail?.order_status_category !== 'archived') && (
                <Button
                  variant="outline"
                  onClick={onDownloadLabel}
                  disabled={isDownloadingLabel || requiresManualLabel}
                  className="flex items-center scale-3d! gap-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold h-8 px-4 text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  {isDownloadingLabel ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {requiresManualLabel ? 'LABEL NOT YET GENERATED' : 'REPRINT LABEL'}
                </Button>
              )}
              {canRestoreOrder && (
                <Button
                  variant="outline"
                  onClick={() => requestRestore(orderDetail?.order_number || orderID)}
                  disabled={isRestoring}
                  className="flex items-center gap-2 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold h-8 px-4 text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  {isRestoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArchiveRestore className="h-4 w-4" />}
                  RESTORE ORDER
                </Button>
              )}
              {orderDetail?.order_status_category !== 'archived' && (
                <Button
                  variant="outline"
                  onClick={onCloneOrder}
                  className="flex items-center scale-3d! gap-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold h-8 px-4 text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <Copy className='w-4 h-4 text-primary' />
                  Clone
                </Button>
              )}
              {(orderDetail?.order_status_category === 'new' || orderDetail?.order_status_category === 'printed' || orderDetail?.status.toLocaleLowerCase() === 'new' || orderDetail?.status.toLowerCase() === 'printed') && (
                <>
<<<<<<< HEAD
                  {orderDetail?.order_status_category === 'new' || orderDetail?.status.toLocaleLowerCase() === 'new' || (orderDetail?.courier_details?.courier_code === 'couriersplease') ? (
=======
                  {orderDetail?.order_status_category === 'new' || orderDetail?.status.toLocaleLowerCase() === 'new' || (orderDetail?.courier_details?.is_own_courier) ? (
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                    <Button
                      variant="outline"
                      onClick={() => setShowArchiveModal(true)}
                      className="flex items-center gap-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold h-8 px-4 text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      disabled={orderDetail?.cancel_request !== null}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>
                        {orderDetail?.cancel_request !== null ? 'CANCEL REQUESTED' : 'DELETE ORDER'}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelModal(true)}
                      className="flex items-center gap-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold h-8 px-4 text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      disabled={orderDetail?.cancel_request !== null}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>
                        {orderDetail?.cancel_request !== null ? 'CANCEL REQUESTED' : 'DELETE ORDER'}
                      </span>
                    </Button>
                  )}
                </>
              )}
            </>
          )}
<<<<<<< HEAD
          {!isCreate && orderDetail?.order_number && orderDetail?.order_status_category !== 'archived' && (
            <DropdownCustomMenu
              contentClassName="w-56 min-w-56"
              menus={[
                {
                  label: 'Print packing slip',
                  onClick: () => handlePackingDownload('packing-slip'),
                  icon: FileText,
                },
                {
                  label: 'Print packing summary',
                  onClick: () => handlePackingDownload('packing-summary'),
                  icon: ClipboardList,
                },
              ]}
            >
              <Button
                variant="outline"
                disabled={isDownloadingPackingDocument}
                className="flex items-center gap-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold h-8 px-4 text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
              >
                {isDownloadingPackingDocument ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                More actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownCustomMenu>
          )}
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
          {role === 'admin' && (orderType === 'create' || orderType === 'create-menual') && (
            <FormSelect
              label="Customer"
              placeholder="Select Customer"
              value={selectedCustomer?.toString() || ''}
              onValueChange={(val) => setSelectedCustomer(val ? Number(val) : undefined)}
              options={customersData?.data?.filter((c: any) => c.status_code === "1").map((c: any) => ({
                value: c.id.toString(),
                label: `${c.first_name} ${c.last_name} (${c.email})`
              })) || []}
              className='w-70'
              allowClear={false}
            />
          )}
          <ConformationModal
            open={showCancelModal}
            onOpenChange={setShowCancelModal}
            title="Cancel Order"
            description={
              <div className="space-y-4">
                {(orderDetail?.courier_details?.courier_code === "direct_freight_express_tranzit_group" || orderDetail?.courier_details?.courier_code === "auspost_tranzit_group") && (
                  <>
                    <p className="text-sm mb-0 font-medium text-slate-900">Are you sure you want to cancel this order?</p>
                    <p className="text-sm mb-0 font-medium text-slate-900"> This action can’t be undone once the cancellation is processed.</p>
                    <div className="my-3 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                      <p className="mb-0 text-amber-800 dark:text-amber-400 font-semibold text-xs">Important: A {orderDetail?.courier_details?.courier_code === "direct_freight_express_tranzit_group" ? "$5" : "$3"} cancellation service fee applies to {orderDetail?.courier_details?.courier || 'Direct Freight'} bookings.</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-900 text-sm mb-0">If the cancellation is successful:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>You will receive a confirmation notification from us</li>
                        <li>{orderDetail?.courier_details?.courier_code === "direct_freight_express_tranzit_group" ? "$5" : "$3"} will be deducted from your refund amount</li>
                      </ul>
                    </div>
                  </>)}
                <p className="mb-0 font-medium text-sm text-slate-900">Do you want to proceed with cancelling this order?</p>
              </div>
            }
            onConfirm={() => onCancelOrder?.(true)}
            confirmText="Yes, Cancel order"
            cancelText="No, Keep order"
            confirmVariant="destructive"
            loading={isCancelling}
            className="max-w-[440px] sm:max-w-[500px]"
          />
          <ConformationModal
            open={showArchiveModal}
            onOpenChange={setShowArchiveModal}
            title="Cancel Order"
            description={
              <p className="text-sm mb-0 font-medium text-slate-900">Are you sure you want to delete this order?</p>
            }
            onConfirm={() => onArchiveOrder?.(true)}
            confirmText="Yes, Cancel order"
            cancelText="No, Keep order"
            confirmVariant="destructive"
            loading={isCancelling}
            className="max-w-[440px] sm:max-w-[500px]"
          />
          {restoreModal}

        </div>
      </div>

      {
        !isCreate && (<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-zinc-400 font-medium">
          <Badge variant="secondary" className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-none rounded-sm px-2 py-0 h-5 uppercase font-bold">
            {orderDetail?.order_type || 'NEW'}
          </Badge>


          <div className="flex items-center gap-1">
            Created
            <CustomTooltip title={orderDetail.created_at}>
              <span className="text-gray-700 dark:text-zinc-300">{orderDetail?.created_human}</span>
            </CustomTooltip>
          </div>
          <Badge variant="secondary" className={cn("border-none rounded-sm px-2 py-0 h-5 uppercase font-bold", Order_status_styles[orderDetail?.status?.toLocaleLowerCase() || 'New'])}>
            {orderDetail?.status || 'NEW'}
          </Badge>
          {orderDetail.order_reference && <span className="text-sm text-gray-900 dark:text-zinc-100"> Order Referance - <span className='font-bold'>{orderDetail?.order_reference}</span></span>}
          {orderDetail.customer_reference && <span className="text-sm text-gray-900 dark:text-zinc-100"> Customer Reference - <span className='font-bold'>{orderDetail.courier_details?.customer_reference}</span></span>}
          {/* {orderDetail.external_reference && <span className="text-sm text-gray-900 dark:text-zinc-100"> External Reference - <span className='font-bold'>{orderDetail.courier_details?.external_reference}</span></span>} */}
          {/* {orderDetail.external_order_id && <span className="text-sm text-gray-900 dark:text-zinc-100"> External Order ID - <span className='font-bold'>{orderDetail.courier_details?.external_order_id}</span></span>} */}

        </div>)
      }

      {isTrackingModalOpen && (
        <Dialog open={isTrackingModalOpen} onOpenChange={setIsTrackingModalOpen}>
          <DialogContent className="w-full sm:max-w-[450px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl gap-0">
            <DialogHeader className="px-6 py-4 gap-0 border-b border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-zinc-100 my-0 uppercase tracking-wide">
                Add Tracking Number
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400 my-0">
                Enter the manual shipping tracking number for order #{orderDetail?.order_number}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleTrackingSubmit}>
              <div className="px-6 py-6 space-y-4 bg-slate-50/50 dark:bg-zinc-900/30">
                <FormInput
                  label="Tracking Number"
                  value={trackingNumber}
                  onChange={(val) => {
                    setTrackingNumber(val)
                    if (val.trim()) setTrackingError(false)
                  }}
                  placeholder="Enter tracking number"
                  required
                  error={trackingError}
                  errormsg="Please enter a valid tracking number"
                  isFullWidth
                />
              </div>

              <div className="px-6 py-3 border-t border-gray-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTrackingModalOpen(false)}
                  className="h-8 px-4 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addTrackingMutation.isPending}
                  className="h-8 px-4 text-xs font-semibold flex items-center gap-1.5"
                >
                  {addTrackingMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div >
  )
}
