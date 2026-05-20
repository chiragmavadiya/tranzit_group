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
  Mail,
  Bell,
  CircleDollarSign
} from 'lucide-react'
import { useAppSelector } from '@/hooks/store.hooks'
import {
  useAdminInvoiceDetails,
  useDownloadAdminInvoice,
  useDownloadCustomerInvoice,
  useSendAdminInvoice,
  useRemindAdminInvoice,
  useZohoSyncAdminInvoice,
  // useAdminInvoicePayment,
  useUpdateAdminInvoice,
  useCreateCustomerInvoice,
  useCustomerInvoiceDetails
} from '../hooks/useInvoices'
import { Skeleton } from '@/components/ui/skeleton'
import { AddPaymentDialog } from '../components/AddPaymentDialog'
import { Badge } from '@/components/ui/badge'
import { INVOICE_STATUS_COLORS } from '../constants'
import { cn } from '@/lib/utils';
import type { InvoiceDocumentData } from '../types'


const InvoiceDocumentView: React.FC = () => {
  const { invoiceID } = useParams<{ invoiceID: string }>()
  const navigate = useNavigate()
  const { role } = useAppSelector((state) => state.auth)
  const isAdmin = role === 'admin'
  const [invoiceData, setInvoiceData] = useState<InvoiceDocumentData>({
    "invoice_number": "",
    "zoho_invoice_number": null,
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
    "items": [],
    "orders": [],
    "payment_transactions": []
  })

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
  // const [isEditItemsDialogOpen, setIsEditItemsDialogOpen] = React.useState(false)

  // Fetch Data
  const { data: adminDetails, isLoading: adminIsLoading } = useAdminInvoiceDetails(Number(invoiceID!), invoiceID !== 'create' && isAdmin)
  const { data: customerDetails, isLoading: customerIsLoading } = useCustomerInvoiceDetails(Number(invoiceID!), invoiceID !== 'create' && !isAdmin)
  const details = useMemo(() => isAdmin ? adminDetails : customerDetails, [customerDetails, isAdmin, adminDetails]);
  const isLoading = isAdmin ? adminIsLoading : customerIsLoading;
  // const invoiceData = details?.data

  // Mutations
  const updateMutation = useUpdateAdminInvoice()
  const downloadAdminMutation = useDownloadAdminInvoice()
  const downloadCustomerMutation = useDownloadCustomerInvoice()
  const downloadMutation = isAdmin ? downloadAdminMutation : downloadCustomerMutation
  const sendMutation = useSendAdminInvoice()
  const remindMutation = useRemindAdminInvoice()
  const zohoSyncMutation = useZohoSyncAdminInvoice()
  const createMutation = useCreateCustomerInvoice()
  // const paymentActions = useAdminInvoicePayment()

  const handleBack = useCallback(() => {
    navigate(isAdmin ? '/admin/invoices' : '/invoices')
  }, [navigate, isAdmin])

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
    setInvoiceData((prev: InvoiceDocumentData) => ({
      ...prev,
      issue_date: date
    }))
  }, [])

  useEffect(() => {
    if (invoiceID !== 'create' && details?.status) {
      const data = details?.data
      setInvoiceData({
        ...data,
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
        "zoho_invoice_number": null,
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
        "items": [],
        "orders": [],
        "payment_transactions": []
      })
    }
  }, [details, invoiceID, details?.status])

  const handleSave = useCallback(() => {
    if (!invoiceID) return
    const payload = {
      invoice_number: invoiceData.invoice_number,
      invoice_date: invoiceData.issue_date,
      issued_at: invoiceData.issue_date,
      due_date: invoiceData.due_date,
      status: invoiceData.status,
      amount_paid: invoiceData.till_date_paid || 0,
      balance_due: invoiceData.remaining_balance || 0,
      send_email: invoiceData.send_email || 'yes',
      zoho_invoice_number: invoiceData.zoho_invoice_number,
      customer_id: invoiceData.customer?.id,
      items: invoiceData.items?.map((item: any) => ({
        type: item.type?.toLowerCase(),
        description: item.description,
        total: Number(item.total || item.total_charge_credit || 0),
        order_number: item.order_number,
        item_date: item.date || item.item_date,
        from: item.from,
        destination: item.destination,
        to: item.to,
        receiver: item.receiver
      }))
    }

    if (invoiceID === 'create') {
      createMutation.mutate(payload, {
        onSuccess: (response) => {
          navigate(`${isAdmin ? '/admin' : ''}/invoices/${response?.data?.id}`)
        }
      })
    } else {
      updateMutation.mutate({ id: invoiceID, data: payload })
    }
  }, [invoiceID, invoiceData, createMutation, navigate, isAdmin, updateMutation])

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
          <span className="text-primary font-bold">#{invoiceData?.invoice_number}</span>
          <Badge className={cn("px-3 py-1 font-bold border-none", INVOICE_STATUS_COLORS[invoiceData?.status as keyof typeof INVOICE_STATUS_COLORS])}>
            {invoiceData?.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              {invoiceID !== 'create' && (
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
                    className="h-8 flex items-center gap-2 border-slate-200 dark:border-zinc-800 font-bold text-primary hover:text-primary-hover hover:bg-primary/5 shadow-sm"
                  >
                    {sendMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    Save & Send
                  </Button>
                </>
              )}
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
          {invoiceID !== 'create' && (
            <Button
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
              className="h-8 bg-primary hover:bg-primary-hover text-white flex items-center gap-2 font-bold shadow-lg shadow-primary/20 px-4"
            >
              {downloadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download
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
