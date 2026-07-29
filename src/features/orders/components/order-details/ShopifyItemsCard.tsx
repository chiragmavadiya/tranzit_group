import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ShopifyItem } from '../../types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShoppingBag } from 'lucide-react';

interface ShopifyItemsCardProps {
  items?: ShopifyItem[];
}

export const ShopifyItemsCard: React.FC<ShopifyItemsCardProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

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
              {/* Shopify SVG Bag Icon */}
              {/* <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.117 8.041a1.272 1.272 0 0 0-1.107-.621h-2.195V6.16c0-1.742-1.417-3.16-3.16-3.16H11.34c-1.742 0-3.16 1.418-3.16 3.16v1.26H5.986c-.49 0-.93.28-1.13.722L2.053 14.86c-.05.11-.08.23-.08.36v4.613c0 1.112.905 2.017 2.017 2.017h15.987c1.112 0 2.017-.905 2.017-2.017v-4.613c0-.13-.03-.25-.08-.36l-2.803-6.099zM9.68 6.16c0-.915.745-1.66 1.66-1.66h1.32c.915 0 1.66.745 1.66 1.66v1.26H9.68V6.16zm9.23 13.313H5.063v-3.79h13.847v3.79zm0-5.29H5.063l1.83-3.98h10.158l1.86 3.98z" />
              </svg> */}
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="my-0 text-base font-bold text-slate-800 dark:text-zinc-400 flex items-center gap-2">
                Shopify Order Items
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 font-semibold text-xs border border-emerald-200/50 dark:border-emerald-800/30">
                  {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
                </Badge>
              </h3>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="border-t border-gray-100 dark:border-zinc-800/80 flex flex-col gap-2 pb-0 pt-0">
          <div className="flex flex-col">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800/80 text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
              <div className="col-span-8 md:col-span-9">Product</div>
              <div className="col-span-2 md:col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
            </div>

            {/* Items list */}
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50/40 dark:hover:bg-zinc-900/30 transition-colors">
                  <div className="col-span-8 md:col-span-9 flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 leading-tight">
                      {item.product_name}
                    </span>
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

            {/* Summary footer */}
            <div className="px-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-end text-xs font-medium">
              <div className="flex items-center gap-2">
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
