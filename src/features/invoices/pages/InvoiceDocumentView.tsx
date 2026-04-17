import React, { useCallback } from 'react'
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
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card'

const InvoiceDocumentView: React.FC = () => {
  const { invoiceID } = useParams<{ invoiceID: string }>()
  const navigate = useNavigate()
  console.log(invoiceID)

  // Find the invoice from mock data
  const invoice = {
    "id": 10,
    "user_id": 2,
    "invoice_number": "0010",
    "invoice_date": "2026-04-16T10:00:00.000000Z",
    "created_at": "2026-04-16T10:00:00.000000Z",
    "amount": "500.00",
    "amount_paid": "0.00",
    "status": "Unpaid",
    "zoho_invoice_number": "INV-10293",
    "send_email": "yes",
    "reminder_count": 0,
    "last_reminder_sent_at": null,
    "has_linked_orders": 1,
    "credit_amount": "0.00",
    "user": {
      "name": "Alex Chen",
      "email": "customer1@example.com"
    },
    "balance": "500.00",
    "till_date_paid": "0.00",
    "is_custom": 0,
    "can_remind": true,
    "reminder_reason": "",
    "subtotal": "454.55",
    "gst": "45.45",
    "customer_address": "150 Collins Street, Melbourne, VIC, 3000, Australia",
    "company_details": {
      "name": "Tranzit Group Pty Ltd",
      "abn": "12 690 967 198",
      "address": "12B Bass Ct, Keysborough VIC 3173",
      "email": "accounts@tranzitgroup.com.au"
    },
    "banking_details": {
      "bank_name": "Commonwealth Bank",
      "account_name": "Tranzit Group Pty Ltd",
      "bsb": "063 138",
      "account_number": "1112 4733"
    },
    "terms_conditions": [
      "Payment is due within 7 days of the invoice date.",
      "Late payments may incur a 1.5% interest fee per month.",
      "Ownership of deliverables transfers upon receipt of full payment.",
      "Any disputes should be reported within 7 business days."
    ],
    "line_items": [
      {
        "id": 1,
        "type": "Custom",
        "date": "16/04/2026",
        "order_number": "ORD-7721",
        "description": "Premium Logistics Consultation",
        "from": "Melbourne, VIC",
        "destination": "Sydney, NSW",
        "to": "Sydney, NSW",
        "receiver": "John Doe",
        "amount": "500.00"
      }
    ]
  }

  const handleBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

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
            Viewing Invoice <span className="text-blue-600 dark:text-blue-400">#{invoice.invoice_number}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
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
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20"
          >
            <Download className="h-4 w-4" />
            DOWNLOAD PDF
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 gap-8 items-start">

          {/* The Actual Invoice Paper */}
          <div className="flex justify-center print:block">
            <InvoicePaper invoice={invoice} />
          </div>

          {/* Side Panel Actions - Hidden on Print */}
          {/* <div className="space-y-6 print:hidden">
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-zinc-900 ring-1 ring-slate-200 dark:ring-zinc-800">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3 h-11 font-bold border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800">
                  <Mail className="h-4 w-4 text-blue-500" />
                  Send to Customer
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-11 font-bold border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800">
                  <Share2 className="h-4 w-4 text-emerald-500" />
                  Share Link
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-11 font-bold border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800">
                  <FileCheck className="h-4 w-4 text-purple-500" />
                  Mark as Paid
                </Button>
              </CardContent>
            </Card>

            <div className="p-6 bg-blue-600 rounded-xl shadow-xl shadow-blue-500/30">
              <h4 className="text-white font-black uppercase tracking-widest text-[10px] opacity-80 mb-2">Total Outstanding</h4>
              <p className="text-3xl font-black text-white tracking-tighter mb-4">${parseFloat(invoice.balance).toLocaleString()}</p>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest text-xs h-12">
                COLLECT PAYMENT
              </Button>
            </div>

            <p className="text-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-relaxed">
              Invoice Generated on {new Date(invoice.created_at).toLocaleDateString()}<br />
              Last Reminder Sent: Never
            </p>
          </div> */}
        </div>
      </main>
    </div>
  )
}

export default InvoiceDocumentView
