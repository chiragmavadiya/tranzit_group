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
  ChevronDown
} from 'lucide-react'
import { cn, formateCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  DropdownCustomMenu,
} from '@/components/ui/dropdown-menu';
import { FormInput, FormSelect } from '@/features/orders/components/OrderFormUI'
import { BANKING_DETAILS, COMPANY_DETAILS, TERMS_CONDITIONS } from '../../constants'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import DatePicker from '@/components/common/DatePicker'

interface InvoicePaperProps {
  invoice: any;
  isAdmin?: boolean;
  onUpdateDate?: (date: string) => void;
  setInvoiceData: React.Dispatch<React.SetStateAction<any>>;
  invoiceId: string;
  onEditPayment?: (payment: any) => void;
  onDeletePayment?: (paymentId: string | number) => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

export const InvoicePaper: React.FC<InvoicePaperProps> = ({
  invoice,
  isAdmin = false,
  onUpdateDate,
  setInvoiceData,
  invoiceId,
  onEditPayment,
  onDeletePayment
}) => {
  const { data: customersData } = useCustomers({ per_page: 1000 }, invoiceId === 'create');
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

  const updateItemsData = useCallback((id: string | number, type: string, value: string | number | Date) => {
    setInvoiceData?.((prev: any) => ({
      ...prev,
      items: prev?.items?.map((i: any) => {
        if (i.id === id) {
          const updated = { ...i, [type]: value };
          if (type === 'total') {
            updated.total_charge_credit = Number(value);
            updated.total = Number(value);
          }
          return updated;
        }
        return i;
      })
    }))
  }, [setInvoiceData])

  const handleAddItem = (type: string) => {
    const defaultItem = {
      id: Date.now(),
      type,
      date: type === 'order' ? new Date() : '',
      ...(type === 'order' ? { order_number: '' } : { description: '' }),
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
    setInvoiceData?.((prev: any) => ({ ...prev, items: prev?.items.length > 1 ? prev?.items?.filter((i: any) => i.id !== itemId) : prev?.items }))
  }, [setInvoiceData])

  const updateStatus = useCallback((status: string) => {
    setInvoiceData?.((prev: any) => ({ ...prev, status }))
  }, [setInvoiceData])

  // Auto-edit newly added item
  React.useEffect(() => {
    if (shouldAutoEdit && invoice.items?.length > 0) {
      const lastItem = invoice.items[invoice.items.length - 1];
      setEditingRowId(lastItem.id);
      setShouldAutoEdit(false);
    }
  }, [invoice.items, shouldAutoEdit]);

  const calculateGSTBreakdown = (finalAmount: number, gstPercent: number) => {
    const basePrice = finalAmount / (1 + gstPercent / 100);
    const gstAmount = finalAmount - basePrice;

    return {
      basePrice: Number(basePrice.toFixed(2)),
      gstAmount: Number(gstAmount.toFixed(2)),
      finalAmount: Number(finalAmount.toFixed(2)),
    };
  };

  const isCreate = invoiceId === 'create';

  let subtotalExGst = 0;
  let gstVal = 0;
  let totalIncGst = 0;
  let amountPaid = 0;
  let creditAmount = 0;
  let amountDue = 0;

  if (isCreate) {
    let finalAmount = 0;
    (invoice?.items || []).forEach((item: any) => {
      const itemVal = Number(item?.item?.total || item?.total || item?.total_charge_credit || 0);
      if (item?.type === 'credit' || item?.type === 'Credit') {
        // finalAmount -= itemVal;
        creditAmount += itemVal;
      } else {
        finalAmount += itemVal;
      }
    });
    const breakdown = calculateGSTBreakdown(finalAmount, 10);
    subtotalExGst = breakdown.basePrice;
    gstVal = breakdown.gstAmount;
    totalIncGst = breakdown.finalAmount;
    amountPaid = 0;
    amountDue = finalAmount - creditAmount > 0 ? finalAmount - creditAmount : 0;
  } else {
    subtotalExGst = Number(invoice?.totals?.subtotal_ex_gst || 0);
    gstVal = Number(invoice?.totals?.gst || 0);
    totalIncGst = Number(invoice?.totals?.total_inc_gst || 0);
    amountPaid = Number(invoice?.totals?.amount_paid || 0);
    creditAmount = Number(invoice?.totals?.credit_amount || 0);
    amountDue = Number(invoice?.totals?.amount_due || 0);
  }
  console.log(creditAmount, 'creditAmount')
  return (
    <div className="mx-auto w-full bg-white dark:bg-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.05)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] min-h-[1100px] flex flex-col p-8 transition-all duration-300 print:shadow-none print:p-0 font-sans text-slate-900 dark:text-zinc-100">

      {/* 1. Header Layout */}
      <div className="grid grid-cols-3 gap-8 mb-6">
        {/* Left Column (Partition 1) */}
        <div className="flex flex-col justify-between min-h-[160px]">
          <div>
            <img src={TranzitLogo} alt="TG" className="h-10 w-auto" />
          </div>
          <div className="text-sm space-y-0.5 text-slate-600 dark:text-zinc-400 font-medium">
            <p className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wide">
              {invoice.customer_business_name || invoice.customer?.business_name || invoice.customer_full_name || ''}
            </p>
            <p>{invoice.address?.address || ''}</p>
            <p>
              {invoice.address?.suburb ? ((invoice.address?.suburb || '') + " " + (invoice.address?.state || '') + " " + (invoice.address?.postcode || '')) : ''}
            </p>
            {(invoice.customer_email || invoice.customer?.email) && (
              <p>{invoice.customer_email || invoice.customer?.email}</p>
            )}
          </div>
        </div>

        {/* Center Column (Partition 2) */}
        <div className="flex justify-center min-h-[160px]">
          <h1 className="my-0 text-4xl font-black text-primary dark:text-white uppercase tracking-wide">TAX INVOICE</h1>
        </div>

        {/* Right Column (Partition 3) */}
        <div className="flex flex-col justify-between items-end text-right min-h-[160px]">
          <div className="text-sm text-slate-500 dark:text-zinc-400 font-medium space-y-0.5">
            <p className="font-bold text-slate-800 dark:text-white">{COMPANY_DETAILS.name || 'Tranzit Group Pty Ltd'}</p>
            <p>ABN: {COMPANY_DETAILS.abn || '12 690 967 198'}</p>
            <p>{COMPANY_DETAILS.address || '12B Bass Ct, Keysborough VIC 3173'}</p>
            <p>Email: {COMPANY_DETAILS.email || 'accounts@tranzitgroup.com.au'}</p>
          </div>
          <div className="text-sm font-bold text-slate-700 dark:text-zinc-300 space-y-0.5">
            {!isCreate && <p>Invoice No: <span className="text-slate-900 dark:text-white font-black">{invoice?.invoice_number}</span></p>}
            <p>Invoice Date: <span className="text-slate-900 dark:text-white font-black">{formatDate(invoice?.issue_date)}</span></p>
          </div>
        </div>
      </div>

      {/* 2. Summary Status Bar */}
      {/* 2. Summary Status Bar */}
      {isCreate ? (
        <div className="grid grid-cols-[1fr_1fr] gap-6 mb-6 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 bg-slate-50/10 shadow-sm">
          {/* Customer Selection */}
          <div className="space-y-1">
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
                label: `${c.first_name} ${c.last_name} (${c.email})`
              })) || []}
              className="w-full space-y-1 col-span-1"
              selectClassName="h-8 border-slate-200 rounded-md bg-white text-sm"
              allowClear={false}
            />
          </div>

          {/* Invoice Date */}
          <div className="space-y-1">
            <label className="text-[14px] font-medium text-slate-700 dark:text-zinc-400 tracking-wide block mb-0.5 ml-0.5">Invoice Date</label>
            <Popover>
              <PopoverTrigger className="flex items-center justify-between w-full h-8 bg-white hover:bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 px-3 rounded-md font-medium text-sm border border-slate-200 dark:border-zinc-800 cursor-pointer outline-none">
                <span>{formatDate(invoice?.issue_date)}</span>
                <CalendarIcon className="w-4 h-4 text-slate-400" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={invoice?.issue_date ? new Date(invoice?.issue_date) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, 'yyyy-MM-dd');
                      onUpdateDate?.(formattedDate)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-6 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 bg-slate-50/10 shadow-sm items-center">
          {/* Invoice Date Box */}
          <div className="space-y-1">
            <p className="text-sm text-slate-500 font-medium">Invoice Date</p>
            {isAdmin ? (
              <Popover>
                <PopoverTrigger className="flex items-center justify-between w-full h-8 bg-white border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 px-3 rounded-md font-bold text-sm cursor-pointer outline-none">
                  <span>{formatDate(invoice?.issue_date)}</span>
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={invoice?.issue_date ? new Date(invoice?.issue_date) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        onUpdateDate?.(formattedDate)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center justify-between w-full h-8 bg-white border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 px-3 rounded-md font-bold text-sm">
                <span>{formatDate(invoice?.issue_date)}</span>
                <CalendarIcon className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>

          {/* Status Box */}
          <div className="space-y-1">
            <p className="text-sm text-slate-500 font-medium">Status</p>
            {isAdmin ? (
              <FormSelect
                label=""
                value={invoice?.status?.toLowerCase()}
                onValueChange={(val) => updateStatus(val || '')}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'send', label: 'Send' },
                  { value: 'unpaid', label: 'Unpaid' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'paid', label: 'Paid' },
                ]}
                className="w-full space-y-1 col-span-1"
                selectClassName="bg-white border border-slate-200 dark:border-zinc-800 font-bold text-slate-700 dark:text-zinc-300 h-8 rounded-md"
                allowClear={false}
              />
            ) : (
              <div className="flex items-center capitalize w-full h-8 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 px-3 rounded-md font-bold text-sm">
                {invoice?.status || 'Draft'}
              </div>
            )}
          </div>

          {/* Amount Paid Box */}
          <div className="text-center space-y-1">
            <p className="text-sm text-slate-500 font-medium">Amount Paid</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white leading-none mt-1">
              {formateCurrency(invoice?.till_date_paid || invoice?.totals?.amount_paid || 0)}
            </p>
          </div>

          {/* Balance Due Box */}
          <div className="text-center space-y-1">
            <p className="text-sm text-slate-500 font-medium">Balance Due</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white leading-none mt-1">
              {formateCurrency(invoice?.remaining_balance || invoice?.totals?.amount_due || 0)}
            </p>
          </div>
        </div>
      )}

      {/* 3. Line Items Section */}
      <div className="mb-4grow" ref={editingRowRef}>
        <h3 className="text-base font-bold text-slate-700 mb-1">Items</h3>

        <div className="border border-slate-100 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-transparent">
                <TableRow className="hover:bg-transparent border-y border-slate-200 dark:border-zinc-800 bg-transparent">
                  <TableHead className="w-[130px] text-sm font-medium uppercase text-slate-600 dark:text-zinc-400 py-3">Type</TableHead>
                  <TableHead className="w-[135px] text-sm font-medium uppercase text-slate-600 dark:text-zinc-400 py-3">Date</TableHead>
                  <TableHead className=" text-sm font-medium uppercase text-slate-600 dark:text-zinc-400 py-3">Order Number / Description</TableHead>
                  <TableHead className=" text-sm font-medium uppercase text-slate-600 dark:text-zinc-400 py-3">From</TableHead>
                  <TableHead className=" text-sm font-medium uppercase text-slate-600 dark:text-zinc-400 py-3">Destination</TableHead>
                  <TableHead className=" text-sm font-medium uppercase text-slate-600 dark:text-zinc-400 py-3">To</TableHead>
                  <TableHead className=" text-sm font-medium uppercase text-slate-600 dark:text-zinc-400 py-3">Receiver</TableHead>
                  <TableHead className=" text-sm font-medium uppercase text-slate-600 dark:text-zinc-400 py-3">
                    {isAdmin ? 'Total Charge / Credit' : 'Amount'}
                  </TableHead>
                  {isAdmin && <TableHead className="py-3 text-center"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(invoice.items || []).map((item: any, idx: number) => {
                  const isEditing = isAdmin;

                  return (
                    <TableRow
                      key={item.id || idx}
                      // ref={isEditing ? editingRowRef : null}
                      className={cn(
                        "hover:bg-slate-50/30 dark:hover:bg-zinc-800/30 border-b border-slate-50 dark:border-zinc-800/50 last:border-0 transition-colors group relative",
                        isEditing && "bg-primary/5 dark:bg-primary/10"
                      )}
                      onClick={() => {
                        if (isAdmin && !isEditing) {
                          setEditingRowId(item.id || idx);
                        }
                      }}
                    >
                      <TableCell className="py-4">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <FormSelect
                              label=""
                              value={item?.type ? item.type.toLowerCase() : ''}
                              name='type'
                              onValueChange={(val) => updateItemsData(item.id, 'type', val || '')}
                              options={[
                                { value: 'order', label: 'Order' },
                                { value: 'credit', label: 'Credit' },
                                { value: 'custom', label: 'Custom' },
                              ]}
                              className="w-30 space-y-1 col-span-1"
                              selectClassName="h-8 text-sm bg-white border border-slate-200 focus:ring-1 focus:ring-primary rounded-md px-2"
                              allowClear={false}
                              searchdisable
                            />
                          </div>
                        ) : (
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-black uppercase border-none px-2 py-0.5",
                            item.type.toLowerCase() === 'order' ? "bg-primary/10 text-primary" :
                              item.type.toLowerCase() === 'credit' ? "bg-emerald-50 text-emerald-600" :
                                "bg-slate-100 text-slate-600"
                          )}>
                            {item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase() : 'Custom'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing && item.type === 'order' ? (
                          <DatePicker
                            date={item.date || ''}
                            setDate={(val) => updateItemsData(item.id, 'date', val!)}
                            className="h-8 w-[130px] border-slate-200 text-sm  bg-white"
                            placeholder="dd/mm/yyyy"
                          />
                        ) : (
                          <span className="text-[12px] font-medium py-3 text-slate-600">{item.type === 'order' ? formatDate(item.date || item.item_date) : '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          <FormInput
                            className="w-full min-w-[150px] shadow-none col-span-12"
                            inputClassName="h-8 text-sm bg-white border border-slate-200 focus:ring-1 focus:ring-primary rounded-md px-3"
                            value={item.type === 'order' ? item.order_number : item.description || ''}
                            placeholder={item.type === 'order' ? 'Order Number' : item.type === 'credit' ? 'Credit description' : 'Description'}
                            onChange={(val) => updateItemsData(item.id, item.type === 'order' ? 'order_number' : 'description', val)}
                          />
                        ) : (
                          <span className="text-[12px] font-bold text-slate-700 dark:text-zinc-200">{item.type === 'order' ? item.order_number : item.description || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          item.type === 'order' ? (
                            <FormInput
                              className="w-full shadow-none col-span-12"
                              inputClassName="h-8 text-sm bg-white border border-slate-200 focus:ring-1 focus:ring-primary rounded-md px-2"
                              value={item.from || ''}
                              placeholder="e.g. VIC 3000"
                              onChange={(val) => updateItemsData(item.id, 'from', val)}
                            />
                          ) : (
                            <span className="text-[12px] font-medium text-slate-400 dark:text-zinc-600">-</span>
                          )
                        ) : (
                          <span className="text-[12px] font-medium text-slate-600">{item.type === 'order' ? item.from : '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          item.type === 'order' ? (
                            <FormInput
                              className="w-full shadow-none col-span-12"
                              inputClassName="h-8 text-sm bg-white border border-slate-200 focus:ring-1 focus:ring-primary rounded-md px-2"
                              value={item.destination || ''}
                              placeholder="e.g. Melbourne"
                              onChange={(val) => updateItemsData(item.id, 'destination', val)}
                            />
                          ) : (
                            <span className="text-[12px] font-medium text-slate-400 dark:text-zinc-600">-</span>
                          )
                        ) : (
                          <span className="text-[12px] font-medium text-slate-600">{item.type === 'order' ? item.destination : '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          item.type === 'order' ? (
                            <FormInput
                              className="w-full shadow-none col-span-12"
                              inputClassName="h-8 text-sm bg-white border border-slate-200 focus:ring-1 focus:ring-primary rounded-md px-2"
                              value={item.to || ''}
                              placeholder="e.g. VIC 3000"
                              onChange={(val) => updateItemsData(item.id, 'to', val)}
                            />
                          ) : (
                            <span className="text-[12px] font-medium text-slate-400 dark:text-zinc-600">-</span>
                          )
                        ) : (
                          <span className="text-[12px] font-medium text-slate-600">{item.type === 'order' ? item.to : '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          item.type === 'order' ? (
                            <FormInput
                              className="w-full shadow-none col-span-12"
                              inputClassName="h-8 text-sm bg-white border border-slate-200 focus:ring-1 focus:ring-primary rounded-md px-2"
                              value={item.receiver || ''}
                              placeholder="Receiver Name"
                              onChange={(val) => updateItemsData(item.id, 'receiver', val)}
                            />
                          ) : (
                            <span className="text-[12px] font-medium text-slate-400 dark:text-zinc-600">-</span>
                          )
                        ) : (
                          <span className="text-[12px] font-medium text-slate-600">{item.type === 'order' ? item.receiver : '-'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-zinc-800 rounded-md px-2 bg-white dark:bg-zinc-950 h-8 w-28">
                            <span className="text-slate-400 text-sm font-medium">$</span>
                            <input
                              type="number"
                              className="w-full bg-transparent border-none outline-none text-right font-bold text-slate-800 dark:text-white text-sm h-full"
                              value={item.total || item.total_charge_credit || ''}
                              placeholder="0.00"
                              onChange={(e) => updateItemsData(item.id, 'total', e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{formateCurrency(item.total || item.total_charge_credit)}</span>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-center py-4">
                          <div className="flex items-center justify-center">
                            {isEditing ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={invoice.items?.length === 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.id);
                                }}
                                className="h-8 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-3 rounded-md border-none text-sm flex items-center justify-center cursor-pointer transition-colors"
                              >
                                Remove
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={invoice.items?.length === 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.id);
                                }}
                                className="h-7 w-7 p-0 text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}

              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add Item Button below table (Admin Only) */}
        {isAdmin && (
          <div className="mt-3">
            <DropdownCustomMenu
              menus={[
                { label: 'Custom', onClick: () => handleAddItem('custom') },
                { label: 'Credit', onClick: () => handleAddItem('credit') },
                { label: 'Order', onClick: () => handleAddItem('order') }
              ]}
            >
              <Button variant="outline" size="sm" className="h-8 text-sm gap-1 font-bold text-slate-700 bg-slate-100/50 hover:bg-slate-200 border border-slate-200 focus:ring-1 focus:ring-primary rounded-md px-3">
                Add Item
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownCustomMenu>
          </div>
        )}
      </div>

      {/* Payment transactions */}
      {invoiceId !== 'create' && (invoice.payment_transactions || []).length > 0 && (
        <div className="mt-6">
          <h3 className="mt-0 text-base font-bold text-slate-800 dark:text-white mb-1">Payment Transactions</h3>
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[500px]">
                <TableHeader className="bg-slate-100 dark:bg-zinc-800/80">
                  <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-zinc-800">
                    <TableHead className="text-sm font-bold uppercase text-slate-600 dark:text-zinc-400 py-3 pl-4">Date</TableHead>
                    <TableHead className="text-sm font-bold uppercase text-slate-600 dark:text-zinc-400 py-3">Method</TableHead>
                    <TableHead className="text-sm font-bold uppercase text-slate-600 dark:text-zinc-400 py-3">Note</TableHead>
                    <TableHead className="text-sm font-bold uppercase text-slate-600 dark:text-zinc-400 py-3">Added By</TableHead>
                    <TableHead className="text-sm font-bold uppercase text-slate-600 dark:text-zinc-400 py-3 text-right">Amount</TableHead>
                    {isAdmin && <TableHead className="text-sm font-bold uppercase text-slate-600 dark:text-zinc-400 py-3 text-center">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(invoice.payment_transactions || []).length > 0 ? (
                    invoice.payment_transactions.map((p: any, idx: number) => (
                      <TableRow key={idx} className="border-b border-slate-100 dark:border-zinc-800/50 last:border-0 transition-colors hover:bg-slate-50/30">
                        <TableCell className="text-sm font-medium py-3 pl-4">{formatDate(p.payment_date || p.date)}</TableCell>
                        <TableCell className="text-sm font-medium py-3 text-slate-600 dark:text-zinc-400">{p.payment_method || p.method}</TableCell>
                        <TableCell className="text-sm font-medium py-3 text-slate-600 dark:text-zinc-400 truncate max-w-[100px]">{p.note || '-'}</TableCell>
                        <TableCell className="text-sm font-medium py-3 text-slate-600 dark:text-zinc-400">{p.added_by || 'Admin'}</TableCell>
                        <TableCell className="text-sm font-bold py-3 text-right text-slate-800 dark:text-zinc-200 pr-4">{formateCurrency(p.amount)}</TableCell>
                        {isAdmin && (
                          <TableCell className="py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEditPayment?.(p)}
                                className="h-7 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded px-3 hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDeletePayment?.(p.payment_id)}
                                className="h-7 text-sm font-bold text-red-600 bg-white border border-red-200 rounded px-3 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 6 : 5} className="text-sm font-medium text-slate-400 text-center py-6">No transactions recorded</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 pt-8 dark:border-zinc-800">

        {/* Left: Banking Details & Terms in one card */}
        <div className="bg-[#F8FAFC] dark:bg-zinc-855 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-6">
          {/* Banking Details */}
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 mt-0">Banking Details</h3>
            <div className="space-y-1.5 text-sm text-slate-600 dark:text-zinc-400 font-medium">
              <p>Bank Name: <span className="text-slate-800 dark:text-zinc-200">{BANKING_DETAILS.bank_name || 'Commonwealth Bank'}</span></p>
              <p>Account Name: <span className="text-slate-800 dark:text-zinc-200">{BANKING_DETAILS.account_name || 'Tranzit Group Pty Ltd'}</span></p>
              <p>BSB: <span className="text-slate-800 dark:text-zinc-200">{BANKING_DETAILS.bsb || '063 138'}</span></p>
              <p>Account Number: <span className="text-slate-800 dark:text-zinc-200">{BANKING_DETAILS.account_number || '1112 4733'}</span></p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 mt-0">Terms & Conditions</h3>
            <ul className="text-sm text-slate-500 dark:text-zinc-400 space-y-2.5 list-disc pl-4 font-medium leading-relaxed">
              {TERMS_CONDITIONS.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Summary Card */}
        <div>
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Subtotal (ex GST)</span>
              <span className="text-slate-800 dark:text-white font-bold">{formateCurrency(subtotalExGst)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">GST</span>
              <span className="text-slate-800 dark:text-white font-bold">{formateCurrency(gstVal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-800 dark:text-white font-bold">Total (inc GST)</span>
              <span className="text-slate-800 dark:text-white font-bold">{formateCurrency(totalIncGst)}</span>
            </div>

            <div className="border-t border-slate-100 dark:border-zinc-800 my-2" />

            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Amount Paid</span>
              <span className={`${amountPaid > 0 ? 'text-emerald-600' : 'text-slate-800 dark:text-white'} font-bold`}>{formateCurrency(amountPaid)}</span>
            </div>

            {creditAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Credit Amount</span>
                <span className="text-slate-800 dark:text-white font-bold">{formateCurrency(creditAmount)}</span>
              </div>
            )}

            <div className="border-t border-slate-100 dark:border-zinc-800 my-2" />

            <div className="flex justify-between text-sm">
              <span className="text-slate-800 dark:text-white font-bold">Amount Due</span>
              <span className="text-red-600 font-bold">{formateCurrency(amountDue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
