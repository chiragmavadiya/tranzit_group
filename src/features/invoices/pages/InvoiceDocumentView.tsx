import React, { useCallback, useEffect, useState } from 'react'
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
  Mail,
  Bell,
  CircleDollarSign
} from 'lucide-react'
import { useAppSelector } from '@/hooks/store.hooks'
import {
  useAdminInvoiceDetails,
  useDownloadAdminInvoice,
  useSendAdminInvoice,
  useRemindAdminInvoice,
  useZohoSyncAdminInvoice,
  // useAdminInvoicePayment,
  useUpdateAdminInvoice,
  useCreateCustomerInvoice
} from '../hooks/useInvoices'
import { Skeleton } from '@/components/ui/skeleton'
import { AddPaymentDialog } from '../components/AddPaymentDialog'
import { Badge } from '@/components/ui/badge'
import { INVOICE_STATUS_COLORS } from '../constants'
import { cn } from '@/lib/utils';

const InvoiceDocumentView: React.FC = () => {
  const { invoiceID } = useParams<{ invoiceID: string }>()
  const navigate = useNavigate()
  const { role } = useAppSelector((state) => state.auth)
  const isAdmin = role === 'admin'
  const [invoiceData, setInvoiceData] = useState<any>({
    "invoice": {
      "invoice_number": "",
      "invoice_date": new Date().toISOString().split('T')[0],
      "issued_at": new Date().toISOString().split('T')[0],
      "due_date": null,
      "status": "Send",
      "amount_paid": 0,
      "balance_due": 0,
      "send_email": "yes",
      "zoho_invoice_number": null
    },
    "customer": {},
    "items": [],
    "summary": {
      "subtotal_ex_gst": 0,
      "gst": 0,
      "total_inc_gst": 0,
      "amount_paid": 0,
      "credit_amount": 0,
      "amount_due": 0
    },
    "payments": []
  })

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
  // const [isEditItemsDialogOpen, setIsEditItemsDialogOpen] = React.useState(false)

  // Fetch Data
  const { data: details, isLoading } = useAdminInvoiceDetails(invoiceID!, invoiceID !== 'create')
  // const invoiceData = details?.data

  // Mutations
  const updateMutation = useUpdateAdminInvoice()
  const downloadMutation = useDownloadAdminInvoice()
  const sendMutation = useSendAdminInvoice()
  const remindMutation = useRemindAdminInvoice()
  const zohoSyncMutation = useZohoSyncAdminInvoice()
  const createMutation = useCreateCustomerInvoice()
  // const paymentActions = useAdminInvoicePayment()

  const handleBack = useCallback(() => {
    navigate('/admin/invoices')
  }, [navigate])

  const handleDownload = useCallback(() => {
    if (invoiceID) downloadMutation.mutate(invoiceID)
  }, [invoiceID, downloadMutation])

  const handleSend = useCallback(() => {
    if (invoiceID) sendMutation.mutate(invoiceID)
  }, [invoiceID, sendMutation])

  const handleRemind = useCallback(() => {
    if (invoiceID) remindMutation.mutate(invoiceID)
  }, [invoiceID, remindMutation])

  const handleZohoSync = useCallback(() => {
    if (invoiceID) zohoSyncMutation.mutate(invoiceID)
  }, [invoiceID, zohoSyncMutation])

  const handleUpdateDate = useCallback((date: string) => {
    if (!invoiceID) return
    updateMutation.mutate({ id: invoiceID, data: { invoice_date: date } })
  }, [invoiceID, updateMutation])

  useEffect(() => {
    if (invoiceID !== 'create' && details?.status) {
      setInvoiceData(details?.data)
    } else if (invoiceID === 'create') {
      setInvoiceData({
        "invoice": {
          "invoice_number": "",
          "invoice_date": new Date().toISOString().split('T')[0],
          "issued_at": new Date().toISOString().split('T')[0],
          "due_date": null,
          "status": "Send",
          "amount_paid": 0,
          "balance_due": 0,
          "send_email": "yes",
          "zoho_invoice_number": null
        },
        "customer": {},
        "items": [],
        "summary": {
          "subtotal_ex_gst": 0,
          "gst": 0,
          "total_inc_gst": 0,
          "amount_paid": 0,
          "credit_amount": 0,
          "amount_due": 0
        },
        "payments": []
      })
    }
  }, [details, invoiceID, details?.status])

  const handleSave = useCallback(() => {
    if (!invoiceID) return
    const payload = {
      ...invoiceData.invoice,
      items: invoiceData.items,
      customer_id: invoiceData.customer?.id
    }

    if (invoiceID === 'create') {
      createMutation.mutate(payload)
    } else {
      updateMutation.mutate({ id: invoiceID, data: payload })
    }
  }, [invoiceID, invoiceData, updateMutation, createMutation])

  if (isLoading) {
    return (
      <div className="p-12 space-y-8 animate-pulse bg-slate-50/50 dark:bg-zinc-950 min-h-screen">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-[900px] w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!invoiceData && !isLoading && invoiceID !== 'create') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-widest">Invoice not found</h2>
        <Button onClick={handleBack} variant="outline" className="font-bold">GO BACK</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-0 bg-slate-50 dark:bg-black/40 print:bg-white transition-colors duration-300">

      {/* Navigation Bar - Hidden on Print */}
      <div className="sticky top-0 z-10 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="h-8 group flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all font-bold text-slate-600 dark:text-zinc-400"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            BACK
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-2" />
          <span className="text-blue-600 font-bold dark:text-blue-400">#{invoiceData?.invoice?.invoice_number}</span>
          <Badge className={cn("px-3 py-1 font-bold border-none", INVOICE_STATUS_COLORS[invoiceData?.invoice?.status as keyof typeof INVOICE_STATUS_COLORS])}>
            {invoiceData?.invoice?.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(true)}
                className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shadow-sm"
              >
                <CircleDollarSign className="h-4 w-4" />
                Add Payment
              </Button>

              <Button
                variant="outline"
                onClick={handleRemind}
                disabled={remindMutation.isPending}
                className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 shadow-sm"
              >
                {remindMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                Send Remainder
              </Button>

              <Button
                variant="outline"
                onClick={handleZohoSync}
                disabled={zohoSyncMutation.isPending}
                className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 shadow-sm"
              >
                {zohoSyncMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Send to Zoho
              </Button>
              <Button
                variant="outline"
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 shadow-sm"
              >
                {sendMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Save & Send
              </Button>

              <Button
                variant="outline"
                onClick={handleSave}
                disabled={updateMutation.isPending || createMutation.isPending}
                className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-slate-600 hover:text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                {(updateMutation.isPending || createMutation.isPending) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
            </>
          )}
          <Button
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="h-8 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 px-4"
          >
            {downloadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto no-scrollbar">
        <div className="mx-auto">
          {/* The Actual Invoice Paper */}
          <div className="flex justify-center print:block">
            <InvoicePaper
              invoice={invoiceData}
              isAdmin={isAdmin}
              onUpdateDate={handleUpdateDate}
              setInvoiceData={setInvoiceData}
              invoiceId={invoiceID!}
            />
          </div>
        </div>
      </main>

      <AddPaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        invoiceId={invoiceID!}
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
