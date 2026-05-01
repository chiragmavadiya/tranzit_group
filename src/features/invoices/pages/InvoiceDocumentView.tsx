import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { InvoicePaper } from '../components/invoice-details/InvoicePaper'
// import { MOCK_INVOICES } from '../constants'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Printer,
  Download,
  // Mail,
  // Share2,
  // FileCheck
} from 'lucide-react'
import { useAppSelector } from '@/hooks/store.hooks'
import {
  useAdminInvoiceDetails,
  useDownloadAdminInvoice,
  useSendAdminInvoice,
  useRemindAdminInvoice,
  useZohoSyncAdminInvoice,
  // useAdminInvoicePayment,
  useUpdateAdminInvoice
} from '../hooks/useInvoices'
import { Skeleton } from '@/components/ui/skeleton'
import {
  RefreshCw,
  Mail,
  Bell,
  Plus,
} from 'lucide-react'
import { AddPaymentDialog } from '../components/AddPaymentDialog'
// import { CreateInvoiceDialog } from '../components/CreateInvoiceDialog'
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
  // const paymentActions = useAdminInvoicePayment()

  const handleBack = useCallback(() => {
    navigate('/admin/invoices')
  }, [navigate])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

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

  const handleUpdateStatus = useCallback((status: string) => {
    if (!invoiceID) return
    updateMutation.mutate({ id: invoiceID, data: { status } })
  }, [invoiceID, updateMutation])

  const handleUpdateDate = useCallback((date: string) => {
    if (!invoiceID) return
    updateMutation.mutate({ id: invoiceID, data: { invoice_date: date } })
  }, [invoiceID, updateMutation])

  // const handleUpdateItem = useCallback((itemId: number | string, itemData: any) => {
  //   if (!invoiceID || !invoiceData) return
  //   const currentItems = invoiceData.items || []
  //   const updatedItems = currentItems.map((i: any) =>
  //     i.id === itemId ? { ...i, ...itemData, total: parseFloat(itemData.amount) } : i
  //   )
  //   updateMutation.mutate({ id: invoiceID, data: { items: updatedItems } })
  // }, [invoiceID, invoiceData, updateMutation])

  useEffect(() => {
    console.log("invoiceID", invoiceID)
    if (invoiceID !== 'create' && details?.status) {
      setInvoiceData(details?.data)
    } else if (invoiceID === 'create') {
      console.log("set......")
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

  // Map backend response to InvoicePaper expected structure
  // const mappedInvoice = {
  //   invoice_number: invoiceData.invoice?.invoice_number || '-',
  //   invoice_date: invoiceData.invoice?.invoice_date || '-',
  //   status: invoiceData.invoice?.status || 'Pending',
  //   user: {
  //     address_line: invoiceData.customer?.address?.address1 || '-',
  //     locality_line: `${invoiceData.customer?.address?.suburb || ''} ${invoiceData.customer?.address?.state || ''} ${invoiceData.customer?.address?.postcode || ''}`,
  //     email: invoiceData.customer?.email || '-'
  //   },
  //   company_details: {
  //     name: "Tranzit Group Pty Ltd",
  //     abn: "12 690 967 198",
  //     address: "12B Bass Ct, Keysborough VIC 3173",
  //     email: "accounts@tranzitgroup.com.au"
  //   },
  //   line_items: (invoiceData.items || []).map((item: any) => ({
  //     id: item.id,
  //     type: item.type,
  //     date: item.date || '-',
  //     description: item.description,
  //     from: item.from || '-',
  //     destination: item.destination || '-',
  //     to: item.to || '-',
  //     receiver: item.receiver || '-',
  //     total: item.total || 0
  //   })),
  //   payments: (invoiceData.payments || []).map((p: any) => ({
  //     id: p.id,
  //     payment_date: p.payment_date,
  //     payment_method: p.payment_method,
  //     note: p.note,
  //     added_by: p.added_by,
  //     amount: p.amount
  //   })),

  //   subtotal_ex_gst: invoiceData.summary?.subtotal_ex_gst || 0,
  //   gst: invoiceData.summary?.gst || 0,
  //   total_inc_gst: invoiceData.summary?.total_inc_gst || 0,
  //   amount_paid: invoiceData.summary?.amount_paid || 0,
  //   amount_due: invoiceData.summary?.amount_due || 0,
  //   credit_amount: invoiceData.summary?.credit_amount || 0,
  // }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black/40 print:bg-white transition-colors duration-300">

      {/* Navigation Bar - Hidden on Print */}
      <div className="sticky top-0 z-10 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="group flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all font-bold text-slate-600 dark:text-zinc-400"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            BACK
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-2" />
          <h2 className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest">
            Viewing Invoice <span className="text-blue-600 dark:text-blue-400">#{invoiceData?.invoice?.invoice_number}</span>
          </h2>
          <Badge className={cn("ml-2 px-3 py-1 font-bold border-none", INVOICE_STATUS_COLORS[invoiceData?.invoice?.status as keyof typeof INVOICE_STATUS_COLORS])}>
            {invoiceData?.invoice?.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {updateMutation.isPending && <RefreshCw className="h-4 w-4 animate-spin text-blue-500 mr-2" />}

          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaymentDialogOpen(true)}
                className="flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                ADD PAYMENT
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 shadow-sm"
              >
                {sendMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                SEND
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRemind}
                disabled={remindMutation.isPending}
                className="flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 shadow-sm"
              >
                {remindMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                REMIND
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleZohoSync}
                disabled={zohoSyncMutation.isPending}
                className="flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 shadow-sm"
              >
                {zohoSyncMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                ZOHO SYNC
              </Button>

              <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1" />
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold"
          >
            <Printer className="h-4 w-4" />
            PRINT
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20"
          >
            {downloadMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            DOWNLOAD PDF
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto no-scrollbar">
        <div className="mx-auto">
          {/* The Actual Invoice Paper */}
          <div className="flex justify-center print:block">
            <InvoicePaper
              invoice={invoiceData}
              isAdmin={isAdmin}
              onUpdateStatus={handleUpdateStatus}
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
