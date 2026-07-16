import { useState } from 'react';
import { ChevronDown, MapPin, Phone, Mail, Pencil } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Order } from "../types";

interface CustomerNameCellProps {
  value: string;
  row: Order;
  orderType: string;
  customerEditClick: (id: string) => void;
  fromCustomer: boolean;
  canReadWrite: boolean;
  isAdmin: boolean;
}

export const CustomerNameCell = ({
  value,
  row,
  orderType,
  customerEditClick,
  fromCustomer,
  canReadWrite,
  isAdmin,
}: CustomerNameCellProps) => {
  const [open, setOpen] = useState(false);

  if (fromCustomer) {
    return <span className="whitespace-normal break-words uppercase font-semibold leading-tight">{value}</span>;
  }

  const [street, ...rest] = row.customer_full_address?.split(",") || [];
  const suburbs = rest?.join(",")?.trim() || '';
  // const street = row.customer_full_address?.split(',')?.[0];
  // const suburbs = row.customer_full_address?.split(',')?.[1];
  // const state = row.customer_full_address?.split(',')?.[2];
  // const postcode = row.customer_full_address?.split(',')?.[3];

  if (orderType !== 'new' || !canReadWrite || isAdmin) {
    return (
      <div
        onMouseLeave={() => setOpen(false)}
        className="w-full"
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="w-full">
            <button
              onClick={() => setOpen(prev => !prev)}
              className="w-[calc(100%+12px)] px-1.5 transition-all duration-250 py-1 border border-transparent -mx-1.5 group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 group-hover/row:bg-white dark:group-hover/row:bg-zinc-900 rounded-sm flex items-center justify-between hover:text-primary outline-none cursor-pointer text-slate-800 dark:text-zinc-200 min-w-0"
            >
              <span className="whitespace-normal break-words uppercase font-medium flex-1 text-left pr-1 leading-tight">{value}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-250 text-slate-400 dark:text-zinc-500 shrink-0 ml-1" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            onMouseLeave={() => setOpen(false)}
            sideOffset={0}
            className="w-72 p-4 text-sm text-slate-700 dark:text-zinc-300 font-normal bg-white dark:bg-zinc-950 rounded-sm border border-gray-200 dark:border-zinc-800 shadow-md"
            align="start"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary/80 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-zinc-100 text-[14px] leading-tight">{street}</span>
                  <span className="text-slate-500 dark:text-zinc-400 text-[12px] mt-1 leading-normal">{suburbs}</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-zinc-800" />

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary/80 shrink-0" />
                <span className="font-medium">{row.receiver_phone || 'Not Provided'}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary/80 shrink-0" />
                <span className="font-medium break-all">{row.receiver_email || 'Not Provided'}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="w-[calc(100%+12px)] flex justify-between items-center uppercase font-medium py-1 px-1.5 -mx-1.5 transition-all duration-250 border border-transparent group-hover/row:border-gray-200 dark:group-hover/row:border-zinc-800 group-hover/row:bg-white dark:group-hover/row:bg-zinc-900 rounded-sm text-slate-800 dark:text-zinc-200 min-w-0">
      <span className="whitespace-normal break-words flex-1 text-left pr-1 leading-tight">{value}</span>
      <Pencil onClick={() => customerEditClick(row.order_number)} className="h-3 w-3 shrink-0 cursor-pointer text-primary opacity-0 group-hover/row:opacity-100" />
    </div>
  );
};
