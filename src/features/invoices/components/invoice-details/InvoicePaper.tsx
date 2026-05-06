import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import TranzitLogo from '@/assets/Tranzit_Logo.svg'
import {
  Calendar as CalendarIcon,
  Trash2,
  Info,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  DropdownCustomMenu,
} from '@/components/ui/dropdown-menu';
import { FormSelect } from '@/features/orders/components/OrderFormUI'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { BANKING_DETAILS, COMPANY_DETAILS, TERMS_CONDITIONS } from '../../constants'

interface InvoicePaperProps {
  invoice: any;
  isAdmin?: boolean;
  onUpdateDate?: (date: string) => void;
  setInvoiceData: React.Dispatch<React.SetStateAction<any>>;
  invoiceId: string;
}

export const InvoicePaper: React.FC<InvoicePaperProps> = ({
  invoice,
  isAdmin = false,
  onUpdateDate,
  setInvoiceData,
  invoiceId
}) => {
  const { data: customersData } = useCustomers({ pageSize: 1000 }, invoiceId === 'create');
  const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
  const [shouldAutoEdit, setShouldAutoEdit] = useState(false);
  const editingRowRef = useRef<HTMLTableRowElement>(null);

  // Click outside to blur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingRowId !== null && editingRowRef.current && !editingRowRef.current.contains(event.target as Node)) {
        setEditingRowId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingRowId]);

  const updateItemsData = useCallback((id: string | number, type: string, value: string | number) => {
    setInvoiceData?.((prev: any) => ({
      ...prev,
      items: prev?.items?.map((i: any) => i.id === id ? { ...i, [type]: value } : i)
    }))
  }, [setInvoiceData])

  const handleAddItem = (type: string) => {
    const defaultItem = {
      id: Date.now(),
      type,
      date: type === 'order' ? new Date().toLocaleDateString('en-GB') : '',
      description: '',
      from: '',
      destination: '',
      to: '',
      receiver: '',
      total: 0
    };
    setInvoiceData?.((prev: any) => ({ ...prev, items: [...(prev?.items || []), defaultItem] }))
    setShouldAutoEdit(true);
  };

  const handleRemoveItem = useCallback((itemId: string | number) => {
    setInvoiceData?.((prev: any) => ({ ...prev, items: prev?.items?.filter((i: any) => i.id !== itemId) }))
  }, [setInvoiceData])

  const updateStatus = useCallback((status: string) => {
    setInvoiceData?.((prev: any) => ({ ...prev, invoice: { ...prev?.invoice, status } }))
  }, [setInvoiceData])

  // Auto-edit newly added item
  React.useEffect(() => {
    if (shouldAutoEdit && invoice.line_items?.length > 0) {
      const lastItem = invoice.line_items[invoice.line_items.length - 1];
      setEditingRowId(lastItem.id);
      setShouldAutoEdit(false);
    }
  }, [invoice.line_items, shouldAutoEdit]);

  const formatCurrency = (amount: number | string) => {
    return amount ? `$${amount}` : `$0`
    // console.log(amount)
    // return new Intl.NumberFormat('en-AU', {
    //   style: 'currency',
    //   currency: 'AUD',
    // }).format(typeof amount === 'string' ? parseFloat(amount) : amount)
  }

  return (
    <div className="mx-auto w-full bg-white dark:bg-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.05)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] min-h-[1100px] flex flex-col p-8 sm:p-12 transition-all duration-300 print:shadow-none print:p-0 font-sans text-slate-900 dark:text-zinc-100">

      {/* 1. Header Layout */}
      <div className="flex justify-between items-start mb-0">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900/10 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
              <img src={TranzitLogo} alt="TG" className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight mt-0">{COMPANY_DETAILS.name || 'Tranzit Group Pty Ltd'}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0">ABN: {COMPANY_DETAILS.abn || '12 690 967 198'}</p>
            </div>
          </div>

          <div className="text-xs space-y-1 text-slate-500 dark:text-zinc-400 font-medium max-w-[380px]">
            <p className='font-bold text-xl text-slate-800 dark:text-white'>{invoice.customer?.business_name || ''}</p>
            <p>{invoice.customer?.address_line || ''}</p>
            <p>{invoice.customer?.address?.suburb || ''}</p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <h2 className="text-4xl font-black text-slate-200 dark:text-zinc-800 uppercase tracking-tighter mb-4 mt-0">TAX INVOICE</h2>
          <div className="mt-4 text-[10px] text-slate-400 text-right leading-tight font-medium">
            <p className='my-1'>{COMPANY_DETAILS.address || '12B Bass Ct, Keysborough VIC 3173'}</p>
            <p className='my-1'>{COMPANY_DETAILS.email || 'accounts@tranzitgroup.com.au'}</p>
          </div>
          <div className="space-y-1 text-xs font-bold text-slate-600 dark:text-zinc-300">
            <p><span className="text-slate-400 font-medium">Invoice No:</span> <span className="text-blue-600 dark:text-white font-black">{invoice?.invoice?.invoice_number}</span></p>
            <p><span className="text-slate-400 font-medium">Date:</span> <span className="text-slate-800 dark:text-white font-black">{invoice?.invoice?.invoice_date}</span></p>
          </div>
        </div>
      </div>

      {/* 2. Summary Status Bar */}
      <div className={cn(
        "grid gap-0 mb-4 border border-slate-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm",
        invoiceId === 'create' ? "grid-cols-2" : "grid-cols-4"
      )}>
        {/* Customer Box */}
        {isAdmin && invoiceId === 'create' && (
          <div className="p-4 border-r border-slate-100 dark:border-zinc-800">
            <FormSelect
              label="Customer"
              placeholder="Select Customer"
              value={invoice?.customer?.id?.toString()}
              onValueChange={(val) => {
                const selectedCustomer = customersData?.data?.find((c: any) => c.id.toString() === val);
                if (selectedCustomer) {
                  setInvoiceData((prev: any) => ({
                    ...prev,
                    customer: selectedCustomer
                  }));
                }
              }}
              options={customersData?.data?.map((c: any) => ({
                value: c.id.toString(),
                label: c.business_name || `${c.first_name} ${c.last_name}`
              })) || []}
            />
          </div>
        )}

        {/* Invoice Date Box */}
        <div className="p-4 border-r border-slate-100 dark:border-zinc-800">
          <p className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Invoice Date</p>
          {isAdmin ? (
            <Popover>
              <PopoverTrigger>
                <button className="flex items-center justify-between w-full group cursor-pointer outline-none">
                  <span className="text-[14px] font-bold mt-[2px]">{invoice?.invoice?.invoice_date}</span>
                  <CalendarIcon className="w-4 h-4 ml-2 text-slate-300 group-hover:text-slate-400 transition-colors" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={invoice?.invoice?.invoice_date ? new Date(invoice?.invoice?.invoice_date) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
                      onUpdateDate?.(formattedDate);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold">{invoice.invoice?.invoice_date}</span>
              <CalendarIcon className="w-4 h-4 text-slate-300" />
            </div>
          )}
        </div>

        {/* Other boxes (only if not create) */}
        {invoiceId !== 'create' && (
          <>
            <div className="p-4 border-r border-slate-100 dark:border-zinc-800">
              {isAdmin ? (
                <FormSelect
                  label="Status"
                  value={invoice.invoice?.status}
                  onValueChange={(val) => updateStatus(val || '')}
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'partial', label: 'Partial' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'unpaid', label: 'Unpaid' },
                    { value: 'overdue', label: 'Overdue' },
                  ]}
                />
              ) : (
                <>
                  <p className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Status</p>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[14px] font-bold",
                      invoice.invoice?.status === 'Paid' ? "text-emerald-600" :
                        invoice.invoice?.status === 'Overdue' ? "text-rose-600" : "text-amber-600"
                    )}>{invoice.invoice?.status}</span>
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-r border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-800/20">
              <p className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Amount Paid</p>
              <span className="text-[18px] font-bold text-emerald-600">{formatCurrency(invoice.invoice?.amount_paid)}</span>
            </div>
            <div className="p-4 bg-slate-50/30 dark:bg-zinc-800/20">
              <p className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-400 uppercase tracking-wider mb-2">Balance Due</p>
              <span className="text-[18px] font-bold text-slate-900 dark:text-white">{formatCurrency(invoice.invoice?.balance_due)}</span>
            </div>
          </>
        )}
      </div>

      {/* 3. Line Items Section */}
      <div className="mb-4 grow">
        <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-2">Items</h3>

        <div className="border border-slate-100 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-zinc-800">
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3">Type</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3">Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3">Description</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3">From</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3">Destination</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3">To</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3">Receiver</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3 text-right">Amount</TableHead>
                  {isAdmin && <TableHead className="text-[9px] font-black uppercase text-slate-400 py-3 text-center"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(invoice.items || []).map((item: any, idx: number) => {
                  const isEditing = editingRowId === item.id;

                  return (
                    <TableRow
                      key={item.id || idx}
                      ref={isEditing ? editingRowRef : null}
                      className={cn(
                        "hover:bg-slate-50/30 dark:hover:bg-zinc-800/30 border-b border-slate-50 dark:border-zinc-800/50 last:border-0 transition-colors group relative",
                        isEditing && "bg-blue-50/50 dark:bg-blue-900/10"
                      )}
                      onClick={() => {
                        if (isAdmin && !isEditing) {
                          setEditingRowId(item.id);
                        }
                      }}
                    >
                      <TableCell className="py-4">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <FormSelect
                              label=""
                              value={item.type}
                              onValueChange={(val) => updateItemsData(item.id, 'type', val || '')}
                              options={[
                                { value: 'order', label: 'Order' },
                                { value: 'credit', label: 'Credit' },
                                { value: 'custom', label: 'Custom' },
                              ]}
                            />
                          </div>
                        ) : (
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-black uppercase border-none px-2 py-0.5",
                            item.type === 'order' ? "bg-blue-50 text-blue-600" :
                              item.type === 'credit' ? "bg-emerald-50 text-emerald-600" :
                                "bg-slate-100 text-slate-600"
                          )}>
                            {item.type || 'custom'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          <Input
                            className="h-7 text-[10px] w-24 bg-white focus:ring-1 focus:ring-blue-500 disabled:opacity-30"
                            value={item.date}
                            disabled={item.type !== 'order'}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateItemsData(item.id, 'date', e.target.value)}
                          />
                        ) : (
                          <span className="text-[12px] font-medium py-3 text-slate-600">{item.date || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          <Input
                            className="h-7 text-[10px] bg-white min-w-[150px] focus:ring-1 focus:ring-blue-500"
                            value={item.description}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateItemsData(item.id, 'description', e.target.value)}
                          />
                        ) : (
                          <span className="text-[12px] font-bold text-slate-700 dark:text-zinc-200">{item.description || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          <Input
                            className="h-7 text-[10px] w-20 bg-white focus:ring-1 focus:ring-blue-500 disabled:opacity-30"
                            value={item.from}
                            disabled={item.type !== 'order'}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateItemsData(item.id, 'from', e.target.value)}
                          />
                        ) : (
                          <span className="text-[12px] font-medium text-slate-600">{item.from || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          <Input
                            className="h-7 text-[10px] w-20 bg-white focus:ring-1 focus:ring-blue-500 disabled:opacity-30"
                            value={item.destination}
                            disabled={item.type !== 'order'}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateItemsData(item.id, 'destination', e.target.value)}
                          />
                        ) : (
                          <span className="text-[12px] font-medium text-slate-600">{item.destination || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          <Input
                            className="h-7 text-[10px] w-20 bg-white focus:ring-1 focus:ring-blue-500 disabled:opacity-30"
                            value={item.to}
                            disabled={item.type !== 'order'}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateItemsData(item.id, 'to', e.target.value)}
                          />
                        ) : (
                          <span className="text-[12px] font-medium text-slate-600">{item.to || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          <Input
                            className="h-7 text-[10px] w-24 bg-white focus:ring-1 focus:ring-blue-500 disabled:opacity-30"
                            value={item.receiver}
                            disabled={item.type !== 'order'}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateItemsData(item.id, 'receiver', e.target.value)}
                          />
                        ) : (
                          <span className="text-[12px] font-medium text-slate-600">{item.receiver || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        {isEditing ? (
                          <Input
                            type="number"
                            className="h-7 text-[10px] w-20 bg-white text-right font-bold focus:ring-1 focus:ring-blue-500"
                            value={item.amount}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateItemsData(item.id, 'amount', e.target.value)}
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(item.total)}</span>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-center py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(item.id);
                              }}
                              className="h-7 w-7 p-0 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}

                {/* Add Item Row (Admin Only) */}
                {isAdmin && (
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 dark:bg-zinc-800/30 border-t-2 border-slate-100 dark:border-zinc-800">
                    <TableCell colSpan={9} className="py-2">
                      <DropdownCustomMenu
                        menus={[
                          { label: 'Custom', onClick: () => handleAddItem('custom') },
                          { label: 'Credit', onClick: () => handleAddItem('credit') },
                          { label: 'Order', onClick: () => handleAddItem('order') }
                        ]}
                      >
                        <Button variant="outline">Add Item</Button>
                      </DropdownCustomMenu>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Payment transactions */}
      <div>
        <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-4">Payment Transactions</h3>
        <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden ">
          <div className="overflow-x-auto">
            <Table className="min-w-[500px]">
              <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/50">
                <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-zinc-800">
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-2 pl-4">Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-2">Method</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-2">Note</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-2">Added By</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-400 py-2 text-right pr-4">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(invoice.payments || []).length > 0 ? (
                  invoice.payments.map((p: any, idx: number) => (
                    <TableRow key={idx} className="border-b border-slate-50 dark:border-zinc-800/50 last:border-0 transition-colors hover:bg-slate-50/30">
                      <TableCell className="text-[12px] font-medium py-3 pl-4">{p.payment_date}</TableCell>
                      <TableCell className="text-[12px] font-medium py-3 text-slate-600">{p.payment_method}</TableCell>
                      <TableCell className="text-[12px] font-medium py-3 text-slate-600 truncate max-w-[100px]">{p.note || '-'}</TableCell>
                      <TableCell className="text-[12px] font-medium py-3 text-slate-600">{p.added_by || 'Admin'}</TableCell>
                      <TableCell className="text-[12px] font-bold py-3 text-right text-emerald-600 pr-4">{formatCurrency(p.amount)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-[10px] font-medium text-slate-300 text-center py-6 italic">No transactions recorded</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* 4. Bottom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 pt-8 dark:border-zinc-800">

        {/* Left: Transactions & Banking */}
        <div className="space-y-10">
          <div className="bg-slate-50/50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <h3 className="text-slate-700 mb-4 text-sm mt-0">Banking Details</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-[11px] font-medium">
              <div>
                <p className="text-slate-500 mb-0.5">Bank Name</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold">{BANKING_DETAILS.bank_name || 'Commonwealth Bank'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">Account Name</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold">{BANKING_DETAILS.account_name || 'Tranzit Group Pty Ltd'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">BSB</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold">{BANKING_DETAILS.bsb || '063 138'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">A/C Number</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold">{BANKING_DETAILS.account_number || '1112 4733'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className=" text-slate-700 text-sm flex items-center gap-2">
              Terms & Conditions
              <Info className="w-3 h-3 opacity-50" />
            </h3>
            <ul className="text-[10px] text-slate-400 space-y-2.5 font-medium leading-relaxed italic">
              {TERMS_CONDITIONS.map((t: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="text-slate-200 mt-1.5 h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Right: Summary & Terms */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-slate-50/50 dark:bg-zinc-900/50 px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm my-0 font-black text-blue-600 uppercase tracking-tight">Invoice Summary</h3>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              {/* Cost Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Subtotal (ex GST)</span>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(invoice?.summary?.subtotal_ex_gst)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">GST (10%)</span>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(invoice?.summary?.gst)}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-slate-50 dark:border-zinc-800/50 pt-4 mt-4">
                  <span className="text-slate-900 dark:text-white font-black">Total (inc GST)</span>
                  <span className="text-slate-900 dark:text-white font-black">{formatCurrency(invoice?.summary?.total_inc_gst)}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-zinc-800 pt-6 space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Amount Paid</span>
                  <span className="text-emerald-600 font-bold">-{formatCurrency(invoice?.summary?.amount_paid)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Credit Amount</span>
                  <span className="text-blue-500 font-bold">-{formatCurrency(invoice?.summary?.credit_amount || 0)}</span>
                </div>
              </div>

              {/* Total Section */}
              <div className="border-t-2 border-slate-100 dark:border-zinc-800 pt-6 flex justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Total</span>
                  <p className="text-[10px] text-slate-400 font-medium">(inc GST)</p>
                </div>
                <span className="text-4xl font-black text-blue-600 tracking-tighter">
                  {formatCurrency(invoice?.summary?.amount_due)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
