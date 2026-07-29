import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { InvoicePaper } from '../components/invoice-details/InvoicePaper'
// import { MOCK_INVOICES } from '../constants'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Download,
  Save,
  Loader2,
  RefreshCw,
  // Mail,
  // Bell,
  CircleDollarSign,
  ChevronDown
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { useAppSelector } from '@/hooks/store.hooks'
import {
  useAdminInvoiceDetails,
  useDownloadAdminInvoice,
  useDownloadCustomerInvoice,
  useSendAdminInvoice,
  // useRemindAdminInvoice,
  useAdminInvoicePayment,
  useUpdateAdminInvoice,
  useCreateCustomerInvoice,
  useCustomerInvoiceDetails
} from '../hooks/useInvoices'
import { useXeroSyncInvoice } from '@/features/xero/hooks/useXero'
import { Skeleton } from '@/components/ui/skeleton'
import { AddPaymentDialog } from '../components/AddPaymentDialog'
import { ConformationModal } from '@/components/common/ConformationModal'
import { showToast } from '@/components/ui/custom-toast'
import type { InvoiceDocumentData } from '../types'
const parseApiDate = (dateStr: any): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];

  const str = String(dateStr).trim();

  // If it's already yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // If it's dd/MM/yy or dd/MM/yyyy or dd-MM-yy or dd-MM-yyyy
  const ddMMyyRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/;
  const match = str.match(ddMMyyRegex);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    let year = match[3];
    if (year.length === 2) {
      year = `20${year}`;
    }
    return `${year}-${month}-${day}`;
  }

  // ISO string or other parseable date string
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch {
    // fallback
  }

  return new Date().toISOString().split('T')[0];
};

const InvoiceDocumentView: React.FC = () => {
  const { invoiceID } = useParams<{ invoiceID: string }>()
  const navigate = useNavigate()
  const { role, is_sub_user, team_access } = useAppSelector((state) => state.auth)
  const canReadWrite = useMemo(() => !is_sub_user || team_access?.permissions?.invoice === 'full', [is_sub_user, team_access]);
  const isAdmin = role === 'admin'
  const [invoiceData, setInvoiceData] = useState<InvoiceDocumentData>({
    "invoice_number": "",
    "status": "Send",
    "customer_full_name": "",
    "customer_email": "",
    "customer": {},
    "total": 0,
    "issue_date": new Date().toISOString().split('T')[0],
    "due_date": null,
    "send_email": "yes",
    "till_date_paid": 0,
    "remaining_balance": 0,
    "totals": {
      "subtotal_ex_gst": 0,
      "gst": 0,
      "total_inc_gst": 0,
      "amount_paid": 0,
      "amount_due": 0,
      "credit_amount": 0
    },
    "address": {
      "address": "",
      "suburb": "",
      "state": "",
      "postcode": ""
    },
    "items": [{
      id: `1`,
      type: "custom",
      description: "",
      total_charge_credit: 0,
      order_number: "",
      item_date: "",
      from: "",
      destination: "Destination",
      to: "To",
      receiver: "Receiver"
    }],
    "orders": [],
    "payment_transactions": []
  })

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
  const [editingPayment, setEditingPayment] = useState<any>(null)
  const [isDeletePaymentConfirmOpen, setIsDeletePaymentConfirmOpen] = React.useState(false)
  const [paymentIdToDelete, setPaymentIdToDelete] = React.useState<string | number | null>(null)
  const [isSendConfirmOpen, setIsSendConfirmOpen] = React.useState(false)
  // const [isEditItemsDialogOpen, setIsEditItemsDialogOpen] = React.useState(false)

  // Fetch Data
  const { data: adminDetails, isLoading: adminIsLoading } = useAdminInvoiceDetails(Number(invoiceID!), invoiceID !== 'create' && isAdmin)
  const { data: customerDetails, isLoading: customerIsLoading } = useCustomerInvoiceDetails(Number(invoiceID!), invoiceID !== 'create' && !isAdmin)
  const details = useMemo(() => isAdmin ? adminDetails : customerDetails, [customerDetails, isAdmin, adminDetails]);
  const isLoading = isAdmin ? adminIsLoading : customerIsLoading;
  const isPaid = details?.data?.status === 'Paid';
  // const invoiceData = details?.data

  // Mutations
  const updateMutation = useUpdateAdminInvoice()
  const downloadAdminMutation = useDownloadAdminInvoice()
  const downloadCustomerMutation = useDownloadCustomerInvoice()
  const downloadMutation = isAdmin ? downloadAdminMutation : downloadCustomerMutation
  const sendMutation = useSendAdminInvoice()
  // const remindMutation = useRemindAdminInvoice()
  const xeroSyncMutation = useXeroSyncInvoice()
  const createMutation = useCreateCustomerInvoice()
  const paymentActions = useAdminInvoicePayment()

  const handleEditPayment = useCallback((payment: any) => {
    setEditingPayment(payment)
    setIsPaymentDialogOpen(true)
  }, [])

  const handleDeletePayment = useCallback((paymentId: string | number) => {
    setPaymentIdToDelete(paymentId)
    setIsDeletePaymentConfirmOpen(true)
  }, [])

  const handleConfirmDeletePayment = useCallback(() => {
    if (paymentIdToDelete) {
      paymentActions.delete.mutate({
        invoiceId: invoiceID!,
        paymentId: paymentIdToDelete
      }, {
        onSuccess: () => {
          setIsDeletePaymentConfirmOpen(false)
          setPaymentIdToDelete(null)
        }
      })
    }
  }, [invoiceID, paymentIdToDelete, paymentActions.delete])

  const handleBack = useCallback(() => {
    navigate(isAdmin ? '/admin/invoices' : '/invoices')
  }, [navigate, isAdmin])

  const handleDownload = useCallback(() => {
    if (invoiceID) downloadMutation.mutate(invoiceID)
  }, [invoiceID, downloadMutation])

  // const handleSend = useCallback(() => {
  //   if (invoiceID) sendMutation.mutate(invoiceID)
  // }, [invoiceID, sendMutation])

  // const handleRemind = useCallback(() => {
  //   if (invoiceID) remindMutation.mutate(invoiceID)
  // }, [invoiceID, remindMutation])

  const handleXeroSync = useCallback(() => {
    if (invoiceID) xeroSyncMutation.mutate(invoiceID)
  }, [invoiceID, xeroSyncMutation])

  const handleUpdateDate = useCallback((date: string) => {
    setInvoiceData((prev: InvoiceDocumentData) => ({
      ...prev,
      issue_date: date
    }))
  }, [])

  useEffect(() => {
    if (invoiceID !== 'create' && details?.status) {
      const data = details?.data
      const itemsData = data.items?.map((item: any) => ({
        ...item,
        id: item?.invoice_items_id
      }))
      setInvoiceData({
        ...data,
        items: itemsData,
        issue_date: parseApiDate(data.issue_date),
        status: data.status?.toLowerCase(),
        customer: data.customer || {
          id: data.customer_id,
          first_name: data.customer_full_name?.split(' ')[0] || '',
          last_name: data.customer_full_name?.split(' ').slice(1).join(' ') || '',
          email: data.customer_email,
          business_name: data.customer_business_name
        }
      })
    } else if (invoiceID === 'create') {
      setInvoiceData({
        "invoice_number": "",
        "status": "Send",
        "customer_full_name": "",
        "customer_email": "",
        "customer": {},
        "total": 0,
        "issue_date": new Date().toISOString().split('T')[0],
        "due_date": null,
        "send_email": "yes",
        "till_date_paid": 0,
        "remaining_balance": 0,
        "totals": {
          "subtotal_ex_gst": 0,
          "gst": 0,
          "total_inc_gst": 0,
          "amount_paid": 0,
          "amount_due": 0,
          "credit_amount": 0
        },
        "address": {
          "address": "",
          "suburb": "",
          "state": "",
          "postcode": ""
        },
        "items": [{
          id: `1`,
          type: "custom",
          description: "",
          total_charge_credit: 0,
          order_number: "",
          item_date: "",
          from: "",
          destination: "",
          to: "",
          receiver: ""
        }],
        "orders": [],
        "payment_transactions": []
      })
    }
  }, [details, invoiceID, details?.status])

  const validateInvoice = useCallback(() => {
    if (invoiceID === 'create' && !invoiceData.customer?.id) {
      showToast("Customer is required", "error")
      return false
    }

    if (!invoiceData.items || invoiceData.items.length === 0) {
      showToast("At least one item is required", "error")
      return false
    }

    for (const item of invoiceData.items) {
      const type = item.type?.toLowerCase()
      if (type === 'order' && !String(item.order_number || '').trim()) {
        showToast("Order number is required for order items", "error")
        return false
      }
      if (type === 'custom' && !String(item.description || '').trim()) {
        showToast("Description is required for custom items", "error")
        return false
      }
      if (type === 'credit' && !String(item.description || '').trim()) {
        showToast("Description is required for credit items", "error")
        return false
      }
    }
    return true
  }, [invoiceData, invoiceID])

  const handleSave = useCallback((onSuccessCb?: (id: string) => void) => {
    if (!invoiceID) return
    if (!validateInvoice()) return
    const payload = {
      invoice_number: invoiceData.invoice_number,
      invoice_date: invoiceData.issue_date,
      issued_at: invoiceData.issue_date,
      due_date: invoiceData.due_date,
      status: invoiceData.status,
      amount_paid: invoiceData.till_date_paid || 0,
      balance_due: invoiceData.remaining_balance || 0,
      send_email: invoiceData.send_email || 'yes',
      customer_id: invoiceData.customer?.id,
      items: invoiceData.items?.map((item: any) => ({
        id: item?.id || null,
        type: item.type?.toLowerCase(),
        description: item.description,
        total: Number(item.total || item.total_charge_credit || 0),
        order_number: item.order_number,
        item_date: parseApiDate(item.date || item.item_date),
        from: item.from,
        destination: item.destination,
        to: item.to,
        receiver: item.receiver
      }))
    }

    if (invoiceID === 'create') {
      createMutation.mutate(payload, {
        onSuccess: (response) => {
          const newId = response?.data?.id
          navigate(`${isAdmin ? '/admin' : ''}/invoices/${newId}`)
        }
      })
    } else {
      updateMutation.mutate({ id: invoiceID, data: payload }, {
        onSuccess: () => {
          if (onSuccessCb) {
            onSuccessCb(invoiceID)
          }
        }
      })
    }
  }, [invoiceID, invoiceData, createMutation, navigate, isAdmin, updateMutation, validateInvoice])

  const handleConfirmSend = useCallback(() => {
    if (invoiceID) {
      handleSave((actualInvoiceId) => {
        sendMutation.mutate(actualInvoiceId, {
          onSuccess: () => {
            setIsSendConfirmOpen(false)
          }
        })
      })
    }
  }, [invoiceID, handleSave, sendMutation])

  const handleSaveOnly = useCallback(() => {
    handleSave()
  }, [handleSave])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black/40 print:hidden">
        {/* Top Bar Skeleton */}
        <div className="w-full bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        {/* Main Paper Skeleton */}
        <main className="flex-grow p-page-padding flex justify-center overflow-y-auto">
          <div className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-xl p-8 lg:p-12 space-y-8">
            {/* Header row */}
            <div className="flex flex-wrap justify-between items-start gap-6 border-b border-slate-100 dark:border-zinc-800 pb-8">
              <div className="space-y-3">
                {/* Logo block */}
                <Skeleton className="h-10 w-32" />
                {/* Customer details block */}
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <div className="space-y-3 text-right flex flex-col items-end">
                {/* Company details */}
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-60" />
                <Skeleton className="h-3.5 w-40" />
                {/* Invoice meta */}
                <div className="space-y-2 pt-6 flex flex-col items-end">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>

            {/* Quick info ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/30">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-28 border border-slate-200 dark:border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-28 border border-slate-200 dark:border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4 pt-4">
              <Skeleton className="h-4 w-12" />
              <div className="border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <div className="h-10 bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800 flex items-center px-4 justify-between">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 w-12" />
                  <Skeleton className="h-3.5 w-48" />
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
                <div className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 flex items-center px-4 justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
              <div className="md:col-span-7 space-y-6 p-6 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/30 dark:bg-zinc-900/10">
                <div className="space-y-2">
                  <Skeleton className="h-4.5 w-28" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-2.5 w-5/6" />
                </div>
              </div>
              <div className="md:col-span-5 p-6 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-4 bg-slate-50/30 dark:bg-zinc-900/10">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 w-12" />
                </div>
                <div className="flex justify-between font-bold border-t border-slate-200 dark:border-zinc-800 pt-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!invoiceData && !isLoading && invoiceID !== 'create') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-wide">Invoice not found</h2>
        <Button onClick={handleBack} variant="outline" className="font-bold">GO BACK</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-0 bg-slate-50 dark:bg-black/40 print:bg-white transition-colors duration-300">

      {/* Navigation Bar - Hidden on Print */}
      <div className="sticky top-0 z-10 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="h-7 sm:h-8 group flex items-center gap-1 sm:gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all font-bold text-xs sm:text-sm text-slate-600 dark:text-zinc-400 px-2 sm:px-3"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span className="hidden sm:inline">BACK</span>
          </Button>
          <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-zinc-800" />
          <span className="text-xs sm:text-sm text-primary font-bold truncate">#{invoiceID !== 'create' ? invoiceData?.invoice_number : 'New'}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {isAdmin && !isPaid && (
            <>
              {invoiceID !== 'create' && (
                <>
                  {/* Desktop view (xl and up): show all inline */}
                  <div className="hidden xl:flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingPayment(null)
                        setIsPaymentDialogOpen(true)
                      }}
                      className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shadow-sm"
                    >
                      <CircleDollarSign className="h-4 w-4" />
                      Add Payment
                    </Button>

                    {/* <Button
                      variant="outline"
                      onClick={handleRemind}
                      disabled={remindMutation.isPending}
                      className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 shadow-sm"
                    >
                      {remindMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                      Send Reminder
                    </Button> */}

                    <Button
                      variant="outline"
                      onClick={handleXeroSync}
                      disabled={xeroSyncMutation.isPending}
                      className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 shadow-sm"
                    >
                      {xeroSyncMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      Send to Xero
                    </Button>
                    {/* <Button
                      variant="outline"
                      onClick={() => {
                        if (validateInvoice()) {
                          setIsSendConfirmOpen(true)
                        }
                      }}
                      disabled={sendMutation.isPending}
                      className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-primary hover:text-primary-hover hover:bg-primary/5 shadow-sm"
                    >
                      {sendMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      Save & Send
                    </Button> */}
                  </div>

                  {/* Tablet/Mobile view (below xl): show in dropdown */}
                  <div className="flex xl:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="outline"
                          className="h-7 sm:h-8 flex items-center gap-1 sm:gap-1.5 border-slate-200 dark:border-zinc-800 font-bold text-xs sm:text-sm text-slate-700 dark:text-zinc-300 shadow-sm cursor-pointer px-2 sm:px-3"
                        >
                          <span className="inline">Actions</span>
                          {/* <span className="sm:hidden">A</span> */}
                          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-1 shadow-md z-50">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingPayment(null)
                            setIsPaymentDialogOpen(true)
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-md cursor-pointer font-medium"
                        >
                          <CircleDollarSign className="h-4 w-4" />
                          Add Payment
                        </DropdownMenuItem>

                        {/* <DropdownMenuItem
                          onClick={handleRemind}
                          disabled={remindMutation.isPending}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-md cursor-pointer font-medium disabled:opacity-50"
                        >
                          {remindMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                          Send Reminder
                        </DropdownMenuItem> */}

                        <DropdownMenuItem
                          onClick={handleXeroSync}
                          disabled={xeroSyncMutation.isPending}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-md cursor-pointer font-medium disabled:opacity-50"
                        >
                          {xeroSyncMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                          Send to Xero
                        </DropdownMenuItem>

                        {/* <DropdownMenuItem
                          onClick={() => {
                            if (validateInvoice()) {
                              setIsSendConfirmOpen(true)
                            }
                          }}
                          disabled={sendMutation.isPending}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-primary dark:text-primary hover:bg-primary/5 rounded-md cursor-pointer font-medium disabled:opacity-50"
                        >
                          {sendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                          Save & Send
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => handleSave()}
                disabled={updateMutation.isPending || createMutation.isPending}
                className="h-7 sm:h-8 flex items-center gap-1 sm:gap-2 border-slate-200 dark:border-zinc-800 font-bold text-xs sm:text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-50 shadow-sm px-2 sm:px-3"
              >
                {(updateMutation.isPending || createMutation.isPending) ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                <span className="hidden sm:inline">Save</span>
              </Button>
            </>
          )}
          {invoiceID !== 'create' && canReadWrite && (
            <Button
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
              className="h-7 sm:h-8 bg-primary hover:bg-primary-hover text-white flex items-center gap-1 sm:gap-2 font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 px-2 sm:px-4"
            >
              {downloadMutation.isPending ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto no-scrollbar">
        <div className="mx-auto">
          {/* The Actual Invoice Paper */}
          <div className="flex justify-center print:block">
            <InvoicePaper
              invoice={invoiceData}
              isAdmin={isAdmin && !isPaid}
              onUpdateDate={handleUpdateDate}
              setInvoiceData={setInvoiceData}
              invoiceId={invoiceID!}
              onEditPayment={handleEditPayment}
              onDeletePayment={handleDeletePayment}
            />
          </div>
        </div>
      </main>

      <AddPaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        invoiceId={invoiceID!}
        payment={editingPayment}
      />

      <ConformationModal
        open={isDeletePaymentConfirmOpen}
        onOpenChange={setIsDeletePaymentConfirmOpen}
        title="Delete Payment Transaction"
        description="Are you sure you want to delete this payment transaction? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleConfirmDeletePayment}
        loading={paymentActions.delete.isPending}
      />

      <ConformationModal
        open={isSendConfirmOpen}
        onOpenChange={setIsSendConfirmOpen}
        title="Save and Send Invoice"
        description="Are you sure to save and send this PDF invoice to the customer?"
        confirmText="Yes, Save & Send"
        cancelText="No, Save Only"
        confirmVariant="default"
        onConfirm={handleConfirmSend}
        onCancel={handleSaveOnly}
        loading={sendMutation.isPending || updateMutation.isPending || createMutation.isPending}
      />

      {/* <CreateInvoiceDialog
        isOpen={isEditItemsDialogOpen}
        onOpenChange={setIsEditItemsDialogOpen}
        invoiceId={invoiceID}
      /> */}
    </div>
  )
}

export default InvoiceDocumentView
