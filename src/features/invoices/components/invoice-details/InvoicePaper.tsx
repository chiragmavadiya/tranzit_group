import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
// import type { Invoice } from '../../types'
import TranzitLogo from '@/assets/Tranzit_Logo.svg'
import { Building2, User, Landmark } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InvoicePaperProps {
  invoice: any
}

export const InvoicePaper: React.FC<InvoicePaperProps> = ({ invoice }) => {
  // Mock data for the stepper/timeline
  const steps = [
    { label: 'Issued', date: '(16/04/2026)', status: 'passed' },
    { label: 'Sent', subLabel: '(Active)', status: 'active' },
    { label: 'Pending Payment', status: 'pending' }
  ]

  return (
    <div className="mx-auto w-full max-w-[850px] bg-white dark:bg-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.08)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] min-h-[1100px] flex flex-col p-10 sm:p-14 transition-all duration-300 print:shadow-none print:p-0 font-sans">

      {/* 1. Header Section (Centered) */}
      <div className="flex flex-col items-center text-center mb-6">
        <img src={TranzitLogo} alt="Tranzit Logo" className="h-14 w-auto mb-6" />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mb-1 uppercase">TAX INVOICE</h1>
        <p className="text-lg font-medium text-slate-500 dark:text-zinc-400">Invoice #{invoice.invoice_number}</p>
      </div>

      {/* 2. Addresses & Summary Section (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_180px] gap-4 mb-0">
        {/* Bill From */}
        <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-5 bg-slate-50/30 dark:bg-zinc-900/30 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-zinc-400">
            <Building2 className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Bill From</span>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{invoice.company_details?.name || 'Tranzit Group Pty Ltd'}</p>
            <div className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              <p>ABN {invoice.company_details?.abn || '12 690 967 198'}</p>
              <p>{invoice.company_details?.address || '12B Bass Ct, Keysborough VIC 3173'}</p>
              <p>{invoice.company_details?.email || 'accounts@tranzitgroup.com.au'}</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-5 bg-slate-50/30 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-zinc-400">
            <User className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Bill To</span>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{invoice.user.name}</p>
            <div className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              <p>{invoice.customer_address || 'Address not provided'}</p>
              <p>{invoice.user.email}</p>
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-5 bg-[#F8FAFC] dark:bg-zinc-800/50 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1">Invoice No:</p>
            <p className="text-xl font-black text-blue-500 dark:text-blue-400 leading-tight">{invoice.invoice_number}</p>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase mb-1">Invoice Date:</p>
            <p className="text-base font-black text-gray-600 dark:text-gray-400 leading-tight">
              {new Date(invoice.invoice_date).toLocaleDateString('en-AU')}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Minimalist Stepper Section */}
      <div className="px-6 py-12 mb-3 select-none">
        <div className="relative flex justify-between items-center max-w-2xl mx-auto">
          {/* Background Line */}
          <div className="absolute h-0.5 bg-slate-200 dark:bg-zinc-800 left-0 right-0 top-1/2 -translate-y-1/2" />

          {/* Active Progress Line */}
          <div className="absolute h-0.5 bg-emerald-500 left-0 w-1/2 top-1/2 -translate-y-1/2 transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all duration-500",
                  step.status === 'passed' ? "bg-emerald-500 border-emerald-500" :
                    step.status === 'active' ? "bg-white dark:bg-zinc-900 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] scale-125" :
                      "bg-white dark:bg-zinc-950 border-slate-300 dark:border-zinc-700"
                )}
              />
              <div className="absolute top-6 flex flex-col items-center min-w-[max-content]">
                <span className={cn(
                  "text-[10px] font-bold whitespace-nowrap",
                  step.status === 'active' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-zinc-500"
                )}>
                  {step.label}
                </span>
                <span className={cn(
                  "text-[9px] font-semibold whitespace-nowrap mt-0.5 opacity-80",
                  step.status === 'active' ? "text-emerald-500" : "text-slate-400"
                )}>
                  {step.date || step.subLabel || ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Items Table Section */}
      <div className="grow mt-8 mb-10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 dark:border-zinc-800 hover:bg-transparent">
              <TableHead className="font-bold text-slate-900 dark:text-zinc-100 text-[11px] uppercase tracking-wider py-4">Type</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-zinc-100 text-[11px] uppercase tracking-wider py-4">Description</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-zinc-100 text-[11px] uppercase tracking-wider py-4 text-center">Order #</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-zinc-100 text-[11px] uppercase tracking-wider py-4 text-right">Total (AUD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(invoice.line_items || []).map((item: any) => (
              <TableRow key={item.id} className="border-b border-slate-100 dark:border-zinc-900 last:border-0 hover:bg-transparent transition-colors group">
                <TableCell className="py-5 text-xs font-medium text-slate-600 dark:text-zinc-400">{item.type || 'Service'}</TableCell>
                <TableCell className="py-5 text-xs font-bold text-slate-900 dark:text-zinc-100">{item.description}</TableCell>
                <TableCell className="py-5 text-xs text-center font-medium text-slate-600 dark:text-zinc-400">{item.order_number}</TableCell>
                <TableCell className="py-5 text-xs text-right font-bold text-slate-900 dark:text-zinc-100">
                  ${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 5. Totals & Banking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 pt-10 border-t border-slate-100 dark:border-zinc-800">
        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-6 bg-slate-50/20 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-zinc-400">
              <Landmark className="h-4 w-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Banking Details</h4>
            </div>
            <div className="text-[11px] space-y-1.5 text-slate-600 dark:text-zinc-400 font-bold">
              <p><span className="text-slate-400 dark:text-zinc-500 w-24 inline-block font-medium">Bank Name:</span> {invoice.banking_details?.bank_name || 'Commonwealth Bank'}</p>
              <p><span className="text-slate-400 dark:text-zinc-500 w-24 inline-block font-medium">Account Name:</span> {invoice.banking_details?.account_name || 'Tranzit Group Pty Ltd'}</p>
              <p><span className="text-slate-400 dark:text-zinc-500 w-24 inline-block font-medium">BSB:</span> {invoice.banking_details?.bsb || '063 138'}</p>
              <p><span className="text-slate-400 dark:text-zinc-500 w-24 inline-block font-medium">A/C Number:</span> {invoice.banking_details?.account_number || '1223 456 7789'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider px-2">
              <span>Subtotal (ex GST)</span>
              <span className="text-slate-900 dark:text-zinc-100">${parseFloat(invoice.subtotal || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider px-2">
              <span>GST</span>
              <span className="text-slate-900 dark:text-zinc-100">${parseFloat(invoice.gst || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-2 px-2 border-t border-slate-100 dark:border-zinc-800 mt-2">
              <span className="text-sm font-black uppercase tracking-tighter text-slate-900 dark:text-zinc-100">Total (inc GST)</span>
              <span className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tighter">
                ${parseFloat(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider px-2">
              <span>Amount Paid</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">${parseFloat(invoice.amount_paid || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {/* Simplified Amount Due */}
            <div className="flex justify-between items-center p-4 bg-slate-100 dark:bg-zinc-800 rounded-lg mt-4 border border-slate-200 dark:border-zinc-700">
              <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400">Amount Due:</span>
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-zinc-100">
                ${parseFloat(invoice.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Terms & Conditions Section */}
      <div className="mt-4 space-y-4 pt-10 border-t border-slate-100 dark:border-zinc-800">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">Terms & Conditions</h4>
        <ul className="text-[10px] text-slate-500 dark:text-zinc-400 space-y-2 list-disc pl-4 font-bold leading-relaxed max-w-3xl">
          {(invoice.terms_conditions || [
            "Payment is due within 7 days of the invoice date. Late payments may incur a 1.5% interest fee per month.",
            "Ownership of deliverables transfers upon receipt of full payment. Partial payments do not grant usage rights.",
            "Any disputes should be reported within 7 business days of receiving the invoice.",
            "Both parties agree to maintain confidentiality and protect all sensitive information.",
            "Our liability is limited to the amount of the invoice and excludes consequential damages.",
            "Either party may terminate with 7 days' notice. Fees apply for work completed up to termination."
          ]).map((term: string, i: number) => (
            <li key={i}>{term}</li>
          ))}
        </ul>
      </div>

      {/* 7. Footer Copyright Section */}
      <div className="mt-auto pt-16 flex flex-col items-center">
        <div className="bg-slate-50 dark:bg-zinc-800/50 w-full py-4 px-6 rounded-b-xl flex flex-col items-center gap-2">
          <img src={TranzitLogo} alt="Logo Small" className="h-6 w-auto opacity-80" />
          <p className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em]">
            Copyright © Tranzit.com. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
