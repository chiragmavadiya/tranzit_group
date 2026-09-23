import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ShopifyItem } from '../../types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShoppingBag, FileText, Tag } from 'lucide-react';
import { CustomTooltip } from '@/components/common/CustomTooltip';
import { SourceStatusBadge } from '../StatusBadge';

interface ShopifyItemsCardProps {
  items?: ShopifyItem[];
  note?: string | null;
  shippingMethod?: string | null;
  shippingPrice?: number | null;
  shippingCurrency?: string | null;
  sourceStatus?: string | null;
}

export const ShopifyItemsCard: React.FC<ShopifyItemsCardProps> = ({
  items,
  note,
  shippingMethod,
  shippingPrice,
  shippingCurrency = 'AUD',
  sourceStatus,
}) => {
  if (!items || items.length === 0) return null;

  const hasPlatformShipping = Boolean(shippingMethod) || shippingPrice != null;

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

  return (
    <Accordion multiple defaultValue={['shopify_items']} className="flex flex-col gap-3">
      <AccordionItem
        value="shopify_items"
        className="border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 shadow-xs border-b overflow-hidden transition-colors duration-300 [&>h3]:my-0"
      >
        <AccordionTrigger className="hover:no-underline py-3 px-4 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400 items-center bg-slate-50 dark:bg-zinc-900 rounded-none cursor-pointer">
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-300">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="my-0 text-base font-bold text-slate-800 dark:text-zinc-400 flex items-center gap-2">
                Shopify Order Items & Shipping Method
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 font-semibold text-xs border border-emerald-200/50 dark:border-emerald-800/30">
                  {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
                </Badge>
                {sourceStatus && <SourceStatusBadge status={sourceStatus} />}
              </h3>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="border-t border-gray-100 dark:border-zinc-800/80 flex flex-col gap-2 pb-0 pt-0">
          <div className="flex flex-col">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800/80 text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
              <div className="col-span-6 md:col-span-7">Product</div>
              <div className="col-span-2 md:col-span-2 text-center">Weight</div>
              <div className="col-span-2 md:col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
            </div>

            {/* Items list */}
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50/40 dark:hover:bg-zinc-900/30 transition-colors">
                  <div className="col-span-6 md:col-span-7 flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 leading-tight">
                      {item.product_name}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      {item.sku && (
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded font-mono text-[10px]">
                          SKU: {item.sku}
                        </span>
                      )}
                      {item.variant_title && (
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded font-semibold tracking-wide text-[10px]">
                          Variant: {item.variant_title}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-2 text-center font-bold text-sm text-gray-800 dark:text-zinc-200">
                    {item?.weight ? `${item.weight} ${item?.weight_unit || 'kg'}` : 'N/A'}
                  </div>
                  <div className="col-span-2 md:col-span-1 text-center font-bold text-sm text-gray-800 dark:text-zinc-200">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-right font-black text-sm text-gray-900 dark:text-zinc-100">
                    ${(item.price || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {hasPlatformShipping && (
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-gray-100 dark:border-zinc-800/80 bg-slate-50/30 dark:bg-zinc-900/30">
                <div className="flex items-center gap-2 min-w-0">
                  <Tag className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-zinc-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">
                    Shipping: {shippingMethod || 'Standard'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 shrink-0">
                    Buyer selected
                  </span>
                </div>
                {shippingPrice != null && (
                  <span className="text-sm font-black text-gray-900 dark:text-zinc-100 whitespace-nowrap">
                    ${Number(shippingPrice).toFixed(2)}{shippingCurrency ? ` ${shippingCurrency}` : ''}
                  </span>
                )}
              </div>
            )}

            {/* Summary footer with inline note and total */}
            <div className="px-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-medium">
              {note ? (
                <div className="flex items-start gap-2 text-amber-800 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 px-3 py-1.5 rounded-md max-w-full sm:max-w-[70%]">
                  <FileText className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span className="line-clamp-4">
                    <strong className="font-bold uppercase tracking-wide text-[10px] mr-1.5">Order Note:</strong>
                    <CustomTooltip title={note} className='inline'>
                      <span className="text-slate-700 dark:text-zinc-300 font-semibold">{note}</span>
                    </CustomTooltip>
                  </span>
                </div>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2 ml-auto shrink-0">
                <span className="text-gray-600 dark:text-zinc-300">Total:</span>
                <span className="font-black text-sm text-gray-900 dark:text-zinc-100">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
